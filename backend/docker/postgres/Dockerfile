# Use the official PostgreSQL 15 image as the base image
FROM postgres:15

# Install the wal2json extension
RUN apt-get update \
    && apt-get install -y postgresql-15-wal2json

# Set the wal_level to logical
CMD ["postgres", "-c", "wal_level=logical"]
