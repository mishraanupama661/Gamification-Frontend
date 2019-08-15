pipeline{
  agent any

  stages{
     /*stage('Installing Dependencies') {
        steps {
          sh 'cd client;npm install;'
              }
          }
      
      stage('Test') {
        steps {
          sh 'cd client;npm test -- --coverage;'
             }
        }
      stage('Sonarqube analysis') {
               environment {
                 scannerHome=tool 'sonar scanner'
            }
              steps { 
                   withSonarQubeEnv('Sonar') {
              sh 'cd client;${scannerHome}/bin/sonar-scanner -Dproject.settings=./Sonar.properties;'
                  }
              }
          }
     stage('Build') {
          steps {
               sh 'cd client;npm run build;'
           }
       }*/
     stage('Zipping') {
       steps {
         sh 'zip -r build.zip ./client;'
           }
       }
      /*stage ('Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                sh 'curl -u ${usr}:${pass} --upload-file build.zip http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/build-${BUILD_NUMBER}.zip'
              }
           }
        }
    stage('Downloading artifact from Nexus for deployment') {
      steps {
           withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
             sh 'cd client;curl -u ${usr}:{pass} http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/build-${BUILD_NUMBER}.zip --output build-${BUILD_NUMBER}.zip;'
           }
        }
     }*/
    stage ('Deploying the artifact from nexus to Deployment  server') {
            steps {
               withCredentials([file(credentialsId: 'gamify-deploy', variable: 'secret_key_for_tomcat')]) {
                 //withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                 sh 'scp -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no build.zip ubuntu@52.66.189.143:~/'
                  //sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;curl -u ${usr}:{pass} http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/build-${BUILD_NUMBER}.zip --output build-${BUILD_NUMBER}.zip;"'
                  //sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;pm2 restart "gamify-front";"'
                  //}
               }   
            }
        }
   }
      /*post {
        success {
             slackSend (color: '#00FF00', message: " SUCCESSFUL: Job '${JOB_NAME} [${BUILD_NUMBER}]' (${BUILD_URL})")
          }
        failure {
             slackSend (color: '#FF0000', message: " FAILED: Job '${JOB_NAME} [${BUILD_NUMBER}]' (${BUILD_URL})")
          }
      }*/
 }
