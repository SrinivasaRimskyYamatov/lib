#include "syscall.h"

long syscall(long num,
             long a1,
             long a2,
             long a3,
             long a4,
             long a5,
             long a6)
{
    long ret;
    asm volatile (
        "mov %1, %%rax\n"
        "mov %2, %%rdi\n"
        "mov %3, %%rsi\n"
        "mov %4, %%rdx\n"
        "mov %5, %%r10\n"
        "mov %6, %%r8\n"
        "mov %7, %%r9\n"
        "syscall\n"
        "mov %%rax, %0\n"
        : "=r"(ret)
        : "r"(num),
          "r"(a1), "r"(a2), "r"(a3),
          "r"(a4), "r"(a5), "r"(a6)
        : "rax", "rdi", "rsi", "rdx",
          "r10", "r8", "r9", "memory"
    );
    return ret;
}