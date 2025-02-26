pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS'
        go 'Go'
    }
    
    environment {
        GO_BACKEND_DIR = 'backend'
        NEXT_FRONTEND_DIR = 'frontend'
        DB_HOST = 'localhost'
        DB_USER = 'admin'
        DB_PASSWORD = 'admin'
        DB_NAME = 'expense_tracker'
        SERVER_HOSTNAME = 'thin.ec2.alluvium.net'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build Go Backend') {
            steps {
                dir(GO_BACKEND_DIR) {
                    sh 'go mod download'
                    sh 'go build -o app'
                }
            }
        }
        
        stage('Test Go Backend') {
            steps {
                dir(GO_BACKEND_DIR) {
                    sh 'go test ./...'
                }
            }
        }
        
        stage('Build Next.js Frontend') {
            steps {
                dir(NEXT_FRONTEND_DIR) {
                    sh 'npm install'
                    // Update API URL in config file
                    sh 'sed -i "s|http://localhost:3001|http://${SERVER_HOSTNAME}:3001|g" config/api.js'
                    sh 'npm run build'
                }
            }
        }
        
        stage('Deploy Go Backend') {
            steps {
                dir(GO_BACKEND_DIR) {
                    sh '''
                    # Stop existing service if running
                    sudo systemctl stop go-app.service || true
                    
                    # Copy binary and service file
                    sudo cp app /usr/local/bin/go-app
                    
                    # Create or update systemd service
                    cat > go-app.service << EOL
[Unit]
Description=Go Expense Tracker API
After=network.target postgresql.service

[Service]
Environment="PORT=3001"
Environment="PG_HOST=${DB_HOST}"
Environment="PG_PORT=5432"
Environment="PG_USERNAME=${DB_USER}"
Environment="PG_PASSWORD=${DB_PASSWORD}"
Environment="PG_DBNAME=${DB_NAME}"
ExecStart=/usr/local/bin/go-app
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=go-app
User=ubuntu

[Install]
WantedBy=multi-user.target
EOL
                    
                    sudo cp go-app.service /etc/systemd/system/
                    sudo systemctl daemon-reload
                    sudo systemctl enable go-app.service
                    sudo systemctl start go-app.service
                    '''
                }
            }
        }
        
        stage('Deploy Next.js Frontend') {
            steps {
                dir(NEXT_FRONTEND_DIR) {
                    sh '''
                    # Create production build directory if it doesn't exist
                    sudo mkdir -p /var/www/nextjs-app
                    
                    # Copy built Next.js files
                    sudo cp -R .next /var/www/nextjs-app/
                    sudo cp -R public /var/www/nextjs-app/
                    sudo cp package.json /var/www/nextjs-app/
                    
                    # Install production dependencies
                    cd /var/www/nextjs-app
                    sudo npm install --production
                    
                    # Create or update systemd service
                    cat > nextjs-app.service << EOL
[Unit]
Description=Next.js Expense Tracker Frontend
After=network.target

[Service]
Environment="NODE_ENV=production"
Environment="PORT=3000"
Environment="NEXT_PUBLIC_API_URL=http://${SERVER_HOSTNAME}:3001"
WorkingDirectory=/var/www/nextjs-app
ExecStart=$(which npm) start
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=nextjs-app
User=ubuntu

[Install]
WantedBy=multi-user.target
EOL
                    
                    sudo cp nextjs-app.service /etc/systemd/system/
                    sudo systemctl daemon-reload
                    sudo systemctl enable nextjs-app.service
                    sudo systemctl start nextjs-app.service
                    '''
                }
            }
        }
    }
    
    post {
        success {
            echo 'Deployment completed successfully!'
        }
        failure {
            echo 'Deployment failed!'
        }
    }
}