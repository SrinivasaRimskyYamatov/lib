#ifndef SYSCALL_H
#define SYSCALL_H

#ifdef __cplusplus
extern "C" {
#endif

long syscall(long num,
             long a1,
             long a2,
             long a3,
             long a4,
             long a5,
             long a6);

#ifdef __cplusplus
}
#endif

#endif