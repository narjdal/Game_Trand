## **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: mochegri <mochegri@student.42.fr>          +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2020/11/04 17:18:52 by mochegri          #+#    #+#              #
#    Updated: 2021/11/27 10:20:23 by mochegri         ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

include .env


all : stop
	docker-compose up -d

up :
	docker-compose up --build -d --remove-orphans
stop :
	docker-compose stop
start:
	docker-compose start
down:
	docker-compose down
ps:
	docker-compose ps

clean :
	docker stop $$(docker ps -qa);\
	docker rm $$(docker ps -qa);\
	docker rmi -f $$(docker images -qa);\
	docker volume rm $$(docker volume ls -q);\
    docker network rm $$(docker network ls -q);

fclean : clean
	docker system prune -a --force
	sudo rm -rf ~/data/*

bonus : all
