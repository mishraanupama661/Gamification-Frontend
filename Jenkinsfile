pipeline{
  agent any

  stages{
      stage('Build') {
        steps {
          sh 'yarn install'
              }
          }
      
      stage('Test') {
        steps {
          sh 'npm test -- --coverage'
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
     }
 }
