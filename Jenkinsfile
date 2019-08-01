pipeline{
  agent any

  stages{
      stage('Build') {
        steps {
          sh 'npm install'
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
              sh '${scannerHome}/bin/sonar-scanner -Dproject.settings=./Sonar.properties'
                  }
              }
          }
     }
 }
