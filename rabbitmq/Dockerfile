FROM rabbitmq:management

RUN apt-get update && apt-get install -y curl unzip && \
    curl -LO https://github.com/rabbitmq/rabbitmq-delayed-message-exchange/releases/download/v4.0.7/rabbitmq_delayed_message_exchange-v4.0.7.ez && \
    mkdir -p /plugins && \
    mv rabbitmq_delayed_message_exchange-v4.0.7.ez /plugins && \
    rabbitmq-plugins enable --offline rabbitmq_delayed_message_exchange