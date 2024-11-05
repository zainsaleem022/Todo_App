# Use the official PostgreSQL image as the base
FROM postgres:13

# Copy the SQL initialization script into the container
COPY init.sql /docker-entrypoint-initdb.d/

# Set environment variables if needed
# ENV POSTGRES_USER=myuser
# ENV POSTGRES_PASSWORD=mypassword
# ENV POSTGRES_DB=mydatabase
