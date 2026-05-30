extern int main();
extern long syscall(long, long, long, long, long, long, long);

#define SYS_exit 60

void _start()
{
    main();
    syscall(SYS_exit, 0, 0, 0, 0, 0, 0);
}