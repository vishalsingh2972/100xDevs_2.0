docker-compose up -d

echo '🟡 - Waiting for database to be ready...'

./wait-for-it.sh "postgresql://postgres:mysecretpassword@localhost:5432/postgres" -- echo '🟢 - Database is ready!'

npx prisma migrate dev --name init
npm run test

docker-compose down