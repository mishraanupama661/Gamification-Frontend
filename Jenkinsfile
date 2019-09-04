#!/usr/bin/env groovy

@Library('pipeline-library-demo')_

pipeline{

   agent any
   
   stages {
   
      stage ('Installing Dependencies') {
        steps {
          dependency()
          } 
        }
      stage ('Testing') {
        steps {
          test()
          }
        }
      stage ('SonarQube Analysis') {
        environment {
                 scannerHome=tool 'sonar scanner'
            }
        steps {
          sonar()
          }
        }        
      stage ('Production Build') {
        steps {
          building()
          }
        }
      stage ('Zipping the build') {
        steps {
          zipping()
          }
        }
      stage ('Artifactory to Nexus') {
        steps {
          nexus()
          }
        }
     }
   }

    /*stage ('Deploying the artifact from nexus to Deployment  server') {
            steps {
               withCredentials([file(credentialsId: 'gamify-deploy', variable: 'secret_key_for_tomcat')]) {
                 withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                 //sh 'cd client;scp -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no build.zip ubuntu@52.66.189.143:~/;'
                  sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;sudo su;wget --user=${usr} --password={pass} http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/build-${BUILD_NUMBER}.zip;"'
                  //sh 'ssh -i ${secret_key_for_tomcat} -o StrictHostKeyChecking=no ubuntu@52.66.189.143 "cd ~;sudo su;pm2 restart "Front";"'
                  }
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
  }*/
