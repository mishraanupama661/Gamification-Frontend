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
         sh 'zip -r gamify-front.zip ./client -x "node_modules"'
           }
       }
      stage ( 'Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                sh 'curl -u ${usr}:${pass} --upload-file gamify-front.zip http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/gamify-front-${BUILD_NUMBER}.zip'
              }
           }
        }
     stage ('Deploy') {
            steps {
               withCredentials([file(credentialsId: 'deploy-server', variable: 'secret_key_for_tomcat')]) {
                 sh 'scp -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no gamify-front.zip ubuntu@13.232.255.41:~/'
                  sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@13.232.255.41 "cd ~;unzip gamify-front.zip;"'
                  sh 'ssh -v -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@13.232.255.41 "cd ~;cd gamify-front;ls;npm install;pm2 start "PORT=6000 serve -s build""'
               }
            }
        } 
     }
 }
