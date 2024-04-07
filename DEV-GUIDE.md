# Intégration des Microfrontends avec Kafka et Service d'Orchestration

Ce guide décrit comment configurer les microfrontends pour publier leurs métadonnées à Kafka, et comment le service d'orchestration consomme ces métadonnées pour mettre à jour un fichier JSON utilisé par l'App Shell pour charger dynamiquement les microfrontends.

## Étape 1: Publication des Métadonnées par les Microfrontends

Chaque microfrontend doit publier ses métadonnées à un topic Kafka. 
pour `dashboard/src/bootstrap.js`:

```javascript
import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'dashboard',
  brokers: ['kafkaBroker1:9092', 'kafkaBroker2:9092']
});

const producer = kafka.producer();

const publishMetadata = async () => {
  await producer.connect();
  await producer.send({
    topic: 'mf-metadata-topic',
    messages: [{ value: JSON.stringify({ name: 'dashboard', script: 'http://localhost:8083/remoteEntry.js' }) }],
  });
  await producer.disconnect();
};

publishMetadata().catch(console.error);

```

## Étape 2: Consommation des Métadonnées par le Service d'Orchestration

Le service d'orchestration doit écouter le topic Kafka microfrontendMetadata pour consommer les messages de métadonnées. 
Inspiration pour MetadataService.java:


```java
@Service
public class MetadataService {

    @KafkaListener(topics = "mf-metadata-topic", groupId = "orchestrationGroup")
    public void consumeMetadata(String message) {
    JSONObject metadata = new JSONObject(message);
    try {
    String currentContent = new String(Files.readAllBytes(Paths.get("path/to/your/metadata.json")));
    JSONObject json = new JSONObject(currentContent);
    json.put(metadata.getString("name"), metadata.getString("script"));
    try (FileWriter file = new FileWriter("path/to/your/metadata.json")) {
    file.write(json.toString());
}
} catch (IOException e) {
    e.printStackTrace();
}
}
}
```
Ensuite, ajoutez un contrôleur MetaDataController.java pour servir le fichier JSON:
```java
@RestController
@RequestMapping("/metadata")
public class MetadataController {

    private final Path filePath = Paths.get("chemin/vers/votre/metadata.json");

    @GetMapping
    public ResponseEntity<String> getMetadata() {
        try {
            String content = new String(Files.readAllBytes(filePath));
            return ResponseEntity.ok().contentType(MediaType.APPLICATION_JSON).body(content);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur lors de la lecture du fichier metadata.json");
        }
    }
}
```


## Étape 3: Container


L'App Shell doit effectuer des appels API au service d'orchestration pour récupérer les métadonnées mises à jour.

Inspiration pour container/src/App.js:


```javascript
useEffect(() => {
   fetch('microfrontends-metadata.json')
           .then(res => res.json())
           .then(metadata => {
              metadata.forEach(mf => {
                 const script = document.createElement('script');
                 script.src = mf.scriptUrl;
                 script.onload = () => {
                    // mf.name correspond au nom du conteneur exposé par le microfrontend dans sa configuration ModuleFederationPlugin
                    const remoteModule = window[mf.name];

                    // Utilise init si défini pour partager correctement les dépendances
                    if (remoteModule && typeof remoteModule.init === 'function') {
                       remoteModule.init(__webpack_share_scopes__.default);
                    }

                    // Utilise get si disponible pour obtenir le module (ou l'application) exposé
                    if (remoteModule && typeof remoteModule.get === 'function') {
                       remoteModule.get('./bootstrap').then(factory => {
                          factory().then(module => {
                             // Ici, vous pouvez effectuer des actions supplémentaires si nécessaire
                             // par exemple, si votre microfrontend expose un composant React, vous pouvez le monter ici
                          });
                       });
                    }
                 };
                 document.head.appendChild(script);
              });
           });
}, []);

```
# Division du travail


### **Dev1 : Microfrontends**

#### Tâches :

1. **Renommage de fichier** :
    - Renommez le fichier `bootstrap.js` existant en `bootstrap1.js` pour chaque microfrontend.
    - Créez un nouveau fichier `bootstrap.js`.

2. **Fichier d'environnement** :
    - Créez un fichier d'environnement pour stocker les métadonnées nécessaires.

3. **Publication des métadonnées** :
    - Dans le nouveau fichier `bootstrap.js`, ajoutez la logique pour publier les métadonnées au topic Kafka `mf-metadata-topic`. Utilisez les données du fichier d'environnement.

4. **Tests avec Kafka** :
    - Créez un topic Kafka nommé `mf-metadata-topic`.
    - Lancez un consommateur Kafka pour écouter ce topic.
    - Exécutez votre code pour publier les métadonnées et vérifiez qu'elles sont reçues par le consommateur Kafka.

---

### **Dev2 : Service Spring Boot**

#### Tâches :

1. **Création du projet Spring Boot** :
    - Initialisez un nouveau projet Spring Boot.

2. **Structure du projet** :
    - Créez deux répertoires : `services` pour la logique métier et `controllers` pour les API endpoints.

3. **Service d'écoute Kafka** :
    - Dans `services`, créez `MetadataService.java` et implémentez la logique pour écouter le topic Kafka `mf-metadata-topic` et consommer les messages.

4. **Contrôleur pour le fichier JSON** :
    - Dans `controllers`, créez `MetaDataController.java` pour servir le fichier JSON contenant les métadonnées.

5. **Tests** :
    - Utilisez un producteur Kafka pour envoyer des données de test au topic `mf-metadata-topic`.
    - Testez l'endpoint de votre contrôleur avec Postman pour s'assurer que le fichier JSON est correctement servi.

---

### **Dev3 : App Shell (Container)**

#### Tâches :

1. **Modification de App.js** :
    - Remplacez les appels API dans `App.js` par un fetch au fichier `microfrontends-metadata.json`.

2. **Utilisation du fichier JSON** :
    - Assurez-vous que `microfrontends-metadata.json` contient les métadonnées nécessaires pour chaque microfrontend.

3. **Chargement dynamique** :
    - Implémentez la logique pour charger dynamiquement les microfrontends basé sur les métadonnées du fichier JSON.
      - POC initial : juste remplir remotes dans webpack. 
      - POC apres : sans la ligne "remotes" dans webpack, consulter le fichier json et coder une fonction loadRemoteModule. 

4. **Tests** :
    - Vérifiez que l'App Shell charge correctement les microfrontends en utilisant les métadonnées du fichier JSON.
    - Testez différents scénarios pour assurer la robustesse de l'implémentation.

---

Voici à quoi pourrait ressembler le fichier JSON contenant les métadonnées pour chaque microfrontend:

//Certains champs comme dependencies, permissions et env peuvent être optionnels et supprimés si on constate qu'ils ne sont pas nécessaires pour notre développement.
```json
[
   {
      "name": "auth",
      "remoteEntryUrl": "http://localhost:8082/remoteEntry.js",
      "version": "1.0.0",
      "dependencies": {
         "react": "17.0.2",
         "react-dom": "17.0.2"
      },
      "permissions": ["login", "logout", "register"],
      "env": {
         "API_URL": "http://localhost:8082/api"
      }
   },
   {
      "name": "marketing",
      "remoteEntryUrl": "http://localhost:8081/remoteEntry.js",
      "version": "1.2.3",
      "dependencies": {
         "vue": "3.0.5"
      },
      "permissions": ["view_marketing_material", "submit_feedback"],
      "env": {
         "API_URL": "http://localhost:8081/api"
      }
   },
   {
      "name": "dashboard",
      "remoteEntryUrl": "http://localhost:8083/remoteEntry.js",
      "version": "2.1.0",
      "dependencies": {
         "angular": "11.2.1"
      },
      "permissions": ["view_dashboard", "edit_profile"],
      "env": {
         "API_URL": "http://localhost:8083/api"
      }
   }
]


```

- name : Identifiant unique du microfrontend. 
- scriptUrl : L'URL où le bundle du microfrontend est accessible. Il est utilisé pour charger dynamiquement le microfrontend. 
- version : Version du microfrontend, permettant de gérer les mises à jour. 
- dependencies : Liste des dépendances clés du microfrontend. Cela aide à s'assurer que l'application conteneur fournit les dépendances nécessaires. 
- permissions : Permissions ou fonctionnalités que le microfrontend expose. Cela aide à contrôler l'accès aux fonctionnalités en fonction des rôles des utilisateurs. 
- env : Variables d'environnement spécifiques au microfrontend, telles que l'URL de l'API backend avec laquelle il interagit.