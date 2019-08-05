pipeline{
  agent any

  stages{
      stage('Installing Dependencies') {
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
       }
     stage('Zipping') {
       steps {
         sh 'cd client;zip -r gamify-front.zip ./build;'
           }
       }
      stage ( 'Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                sh 'cd client;curl -u ${usr}:${pass} --upload-file gamify-front.zip http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/gamify-front-${BUILD_NUMBER}.zip;'
              }
           }
        }
     stage ('Deploy') {
            steps {
               withCredentials([file(credentialsId: 'gamify-deploy', variable: 'secret_key_for_tomcat')]) {
                 sh 'cd client;scp -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no gamify-front.zip ubuntu@52.66.189.143:~/;'
                  sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;unzip gamify-front.zip;"'
                  sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;pm2 start "PORT=3000 serve -s build" --name "gamify";"'
               }
            }
        }
   }
      post {
        success {
             slackSend (color: '#00FF00', message: " SUCCESSFUL: Job '${JOB_NAME} [${BUILD_NUMBER}]' (${BUILD_URL})")
          }
        failure {
             slackSend (color: '#FF0000', message: " FAILED: Job '${JOB_NAME} [${BUILD_NUMBER}]' (${BUILD_URL})")
          }
      }
 }
