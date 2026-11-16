FROM owasp/modsecurity-crs:4.30.0-nginx-alpine-202611090911
USER root
RUN mkdir -p /var/log/erp && chown nginx:nginx /var/log/erp
COPY --chown=nginx:nginx infra/waf/default.conf.template /etc/nginx/templates/conf.d/default.conf.template
COPY --chown=nginx:nginx infra/waf/logging.conf.template /etc/nginx/templates/conf.d/logging.conf.template
COPY --chown=nginx:nginx infra/waf/REQUEST-900-ERP-EXCLUSIONS.conf /opt/owasp-crs/rules/REQUEST-900-ERP-EXCLUSIONS.conf
USER nginx
