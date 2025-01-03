docker build -t mynginx --build-arg cfg_file=dev.conf .
docker run -p 80:80 -d mynginx