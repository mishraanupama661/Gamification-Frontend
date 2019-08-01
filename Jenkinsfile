pipeline{
  agent any

  stages{
      stage('Installing Dependencies') {
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
     stage('Build') {
          steps {
               sh 'npm run build'
           }
       }
     stage('Zipping') {
       steps {
         sh 'zip -r build.zip ./build -x "node_modules"'
           }
       }
      stage ( 'Artifact to Nexus') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'sudipa_nexus', passwordVariable: 'pass', usernameVariable: 'usr')]){
                sh 'curl -u ${usr}:${pass} --upload-file build.zip http://18.224.155.110:8081/nexus/content/repositories/devopstraining/Gamification/build-${BUILD_NUMBER}.zip'
              }
           }
        } 
     }
 }
