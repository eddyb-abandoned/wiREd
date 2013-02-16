#undef __GNUC_MINOR__ // Required to remove MINGW_NOTHROW attribute specifiers.

#define _WIN32
#define _X86_

// MSVCR*.
#include <internal.h>

#include <float.h>
#include <math.h>
#include <stdio.h>
#include <time.h>
#include <unistd.h>

// WINAPI.
#include <commctrl.h>
#include <winspool.h>
#include <windows.h>

// __p__ accessors, not present in mingw headers.
int* __p___argc(void);
unsigned int* __p__commode(void);
char** __p__pgmptr(void);
unsigned int* __p__fmode(void);
unsigned int* __p__osver(void);
unsigned int* __p__winmajor(void);
unsigned int* __p__winminor(void);
unsigned int* __p__winver(void);
char** __p__acmdln(void);
wchar_t** __p__wcmdln(void);
char*** __p___argv(void);
wchar_t*** __p___wargv(void);
char*** __p__environ(void);
wchar_t*** __p__wenviron(void);
char*** __p___initenv(void);
wchar_t*** __p___winitenv(void);
int* __p__timezone(void);

// Miscellaneous MSVCR* functions.
int __cdecl _initterm(_PVFV *,_PVFV *);
int __cdecl _initterm_e(_PVFV *,_PVFV *);