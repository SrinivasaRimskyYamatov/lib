CC=gcc
CXX=g++
CFLAGS=-nostdlib -ffreestanding -O2 -Wall -Wextra -fno-builtin -no-pie
CXXFLAGS=$(CFLAGS)

OBJS=syscall.o start.o main.o

all: main

app: $(OBJS)
	$(CXX) $(CXXFLAGS) -o main $(OBJS)

syscall.o: syscall.c syscall.h
	$(CC) $(CFLAGS) -c syscall.c

start.o: start.c syscall.h
	$(CC) $(CFLAGS) -c start.c

main.o: main.cpp syscall.h
	$(CXX) $(CXXFLAGS) -c main.cpp

clean:
	rm -f *.o main
