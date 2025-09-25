FROM nginx:alpine

# Copy Angular build output
COPY pip/dist/pip-tracker/browser /usr/share/nginx/html

# Copy Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
