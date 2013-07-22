T.__builtin_va_list = function() {return Pointer(null);};
T.__u_char = function() {return T.u8;};
T.__u_short = function() {return T.u16;};
T.__u_int = function() {return T.u32;};
T.__u_long = function() {return T.u32;};
T.__int8_t = function() {return T.i8;};
T.__uint8_t = function() {return T.u8;};
T.__int16_t = function() {return T.i16;};
T.__uint16_t = function() {return T.u16;};
T.__int32_t = function() {return T.i32;};
T.__uint32_t = function() {return T.u32;};
T.__int64_t = function() {return T.i64;};
T.__uint64_t = function() {return T.u64;};
T.__quad_t = function() {return T.i64;};
T.__u_quad_t = function() {return T.u64;};
T.__dev_t = function() {return T.__u_quad_t;};
T.__uid_t = function() {return T.u32;};
T.__gid_t = function() {return T.u32;};
T.__ino_t = function() {return T.u32;};
T.__ino64_t = function() {return T.__u_quad_t;};
T.__mode_t = function() {return T.u32;};
T.__nlink_t = function() {return T.u32;};
T.__off_t = function() {return T.i32;};
T.__off64_t = function() {return T.__quad_t;};
T.__pid_t = function() {return T.i32;};
T.__fsid_t = function() {return Struct('', {
    __val: ArrayType(T.i32, 2)
});};
T.__clock_t = function() {return T.i32;};
T.__rlim_t = function() {return T.u32;};
T.__rlim64_t = function() {return T.__u_quad_t;};
T.__id_t = function() {return T.u32;};
T.__time_t = function() {return T.i32;};
T.__useconds_t = function() {return T.u32;};
T.__suseconds_t = function() {return T.i32;};
T.__daddr_t = function() {return T.i32;};
T.__key_t = function() {return T.i32;};
T.__clockid_t = function() {return T.i32;};
T.__timer_t = function() {return Pointer(null);};
T.__blksize_t = function() {return T.i32;};
T.__blkcnt_t = function() {return T.i32;};
T.__blkcnt64_t = function() {return T.__quad_t;};
T.__fsblkcnt_t = function() {return T.u32;};
T.__fsblkcnt64_t = function() {return T.__u_quad_t;};
T.__fsfilcnt_t = function() {return T.u32;};
T.__fsfilcnt64_t = function() {return T.__u_quad_t;};
T.__fsword_t = function() {return T.i32;};
T.__ssize_t = function() {return T.i32;};
T.__syscall_slong_t = function() {return T.i32;};
T.__syscall_ulong_t = function() {return T.u32;};
T.__loff_t = function() {return T.__off64_t;};
T.__qaddr_t = function() {return Pointer(T.__quad_t);};
T.__caddr_t = function() {return Pointer(T.char);};
T.__intptr_t = function() {return T.i32;};
T.__socklen_t = function() {return T.u32;};
T.__locale_t = function() {return Pointer(Struct('__locale_struct', {
    __locales: ArrayType(Pointer(Struct('__locale_data', null)), 13),
    __ctype_b: Pointer(T.u16),
    __ctype_tolower: Pointer(T.i32),
    __ctype_toupper: Pointer(T.i32),
    __names: ArrayType(Pointer(T.char), 13)
}));};
T.locale_t = function() {return T.__locale_t;};
T.mode_t = function() {return T.__mode_t;};
T.off_t = function() {return T.__off_t;};
T.pid_t = function() {return T.__pid_t;};
T.float_t = function() {return T.f128;};
T.double_t = function() {return T.f128;};
T._LIB_VERSION_TYPE = function() {return Enum('_ISOC_', {
    _IEEE_: 0,
    _SVID_: 1,
    _XOPEN_: 2,
    _POSIX_: 3,
    _ISOC_: 4
});};
T.size_t = function() {return T.u32;};
T.time_t = function() {return T.__time_t;};
T.__cpu_mask = function() {return T.u32;};
T.cpu_set_t = function() {return Struct('', {
    __bits: ArrayType(T.__cpu_mask, NaN /* multiplicative_expression {
     _0: constant {
      _0: '4096'
     },
     _1: [{
      _0: ' ',
      _1: {
       _0: '/',
       _1: ' ',
       _2: primary_expression {
        _0: {
         _0: '(',
         _1: '',
         _2: multiplicative_expression {
          _0: constant {
           _0: '8'
          },
          _1: [{
           _0: ' ',
           _1: {
            _0: '*',
            _1: ' ',
            _2: unary_expression {
             _0: {
              _0: 'sizeof',
              _1: ' ',
              _2: primary_expression {
               _0: {
                _0: '(',
                _1: '',
                _2: primary_expression {
                 _0: '__cpu_mask'
                },
                _3: '',
                _4: ')'
               }
              }
             }
            }
           }
          }]
         },
         _3: '',
         _4: ')'
        }
       }
      }
     }]
    } */)
});};
T.clock_t = function() {return T.__clock_t;};
T.clockid_t = function() {return T.__clockid_t;};
T.timer_t = function() {return T.__timer_t;};
T.pthread_t = function() {return T.u32;};
T.pthread_attr_t = function() {return Union('pthread_attr_t', null);};
T.__pthread_slist_t = function() {return Struct('__pthread_internal_slist', {
    __next: Pointer(Struct('__pthread_internal_slist', null))
});};
T.pthread_mutex_t = function() {return Union('', {
    __data: Struct('__pthread_mutex_s', {
        __lock: T.i32,
        __count: T.u32,
        __owner: T.i32,
        __kind: T.i32,
        __nusers: T.u32,
        __unnamed0: Union('', {
            __spins: T.i32,
            __list: T.__pthread_slist_t
        })
    }),
    __size: ArrayType(T.char, 24),
    __align: T.i32
});};
T.pthread_mutexattr_t = function() {return Union('', {
    __size: ArrayType(T.char, 4),
    __align: T.i32
});};
T.pthread_cond_t = function() {return Union('', {
    __data: Struct('', {
        __lock: T.i32,
        __futex: T.u32,
        __total_seq: T.u64,
        __wakeup_seq: T.u64,
        __woken_seq: T.u64,
        __mutex: Pointer(null),
        __nwaiters: T.u32,
        __broadcast_seq: T.u32
    }),
    __size: ArrayType(T.char, 48),
    __align: T.i64
});};
T.pthread_condattr_t = function() {return Union('', {
    __size: ArrayType(T.char, 4),
    __align: T.i32
});};
T.pthread_key_t = function() {return T.u32;};
T.pthread_once_t = function() {return T.i32;};
T.pthread_rwlock_t = function() {return Union('', {
    __data: Struct('', {
        __lock: T.i32,
        __nr_readers: T.u32,
        __readers_wakeup: T.u32,
        __writer_wakeup: T.u32,
        __nr_readers_queued: T.u32,
        __nr_writers_queued: T.u32,
        __flags: T.u8,
        __shared: T.u8,
        __pad1: T.u8,
        __pad2: T.u8,
        __writer: T.i32
    }),
    __size: ArrayType(T.char, 32),
    __align: T.i32
});};
T.pthread_rwlockattr_t = function() {return Union('', {
    __size: ArrayType(T.char, 8),
    __align: T.i32
});};
T.pthread_spinlock_t = function() {return T.i32;};
T.pthread_barrier_t = function() {return Union('', {
    __size: ArrayType(T.char, 20),
    __align: T.i32
});};
T.pthread_barrierattr_t = function() {return Union('', {
    __size: ArrayType(T.char, 4),
    __align: T.i32
});};
T.__jmp_buf = function() {return ArrayType(T.i32, 6);};
T.__pthread_unwind_buf_t = function() {return Struct('', {
    __cancel_jmp_buf: ArrayType(Struct('', {
        __cancel_jmp_buf: T.__jmp_buf,
        __mask_was_saved: T.i32
    }), 1),
    __pad: ArrayType(Pointer(null), 4)
}, [['aligned']]);};
T.FILE = function() {return Struct('_IO_FILE', null);};
T.__FILE = function() {return Struct('_IO_FILE', null);};
T.__mbstate_t = function() {return Struct('', {
    __count: T.i32,
    __value: Union('', {
        __wch: T.u32,
        __wchb: ArrayType(T.char, 4)
    })
});};
T._G_fpos_t = function() {return Struct('', {
    __pos: T.__off_t,
    __state: T.__mbstate_t
});};
T._G_fpos64_t = function() {return Struct('', {
    __pos: T.__off64_t,
    __state: T.__mbstate_t
});};
T.__gnuc_va_list = function() {return T.__builtin_va_list;};
T._IO_lock_t = function() {return null;};
T._IO_FILE = function() {return Struct('_IO_FILE', null);};
T.__io_read_fn = function() {return Fn(T.__ssize_t, [[Pointer(null), '__cookie'], [Pointer(T.char), '__buf'], [T.size_t, '__nbytes']]);};
T.__io_write_fn = function() {return Fn(T.__ssize_t, [[Pointer(null), '__cookie'], [Pointer(T.char), '__buf'], [T.size_t, '__n']]);};
T.__io_seek_fn = function() {return Fn(T.i32, [[Pointer(null), '__cookie'], [Pointer(T.__off64_t), '__pos'], [T.i32, '__w']]);};
T.__io_close_fn = function() {return Fn(T.i32, [[Pointer(null), '__cookie']]);};
T.va_list = function() {return T.__gnuc_va_list;};
T.ssize_t = function() {return T.__ssize_t;};
T.fpos_t = function() {return T._G_fpos_t;};
T.wchar_t = function() {return T.i32;};
T.__WAIT_STATUS = function() {return Union('', {
    __uptr: Pointer(Union('wait', null)),
    __iptr: Pointer(T.i32)
}, [['transparent_union']]);};
T.div_t = function() {return Struct('', {
    quot: T.i32,
    rem: T.i32
});};
T.ldiv_t = function() {return Struct('', {
    quot: T.i32,
    rem: T.i32
});};
T.lldiv_t = function() {return Struct('', {
    quot: T.i64,
    rem: T.i64
});};
T.u_char = function() {return T.__u_char;};
T.u_short = function() {return T.__u_short;};
T.u_int = function() {return T.__u_int;};
T.u_long = function() {return T.__u_long;};
T.quad_t = function() {return T.__quad_t;};
T.u_quad_t = function() {return T.__u_quad_t;};
T.fsid_t = function() {return T.__fsid_t;};
T.loff_t = function() {return T.__loff_t;};
T.ino_t = function() {return T.__ino_t;};
T.dev_t = function() {return T.__dev_t;};
T.gid_t = function() {return T.__gid_t;};
T.nlink_t = function() {return T.__nlink_t;};
T.uid_t = function() {return T.__uid_t;};
T.id_t = function() {return T.__id_t;};
T.daddr_t = function() {return T.__daddr_t;};
T.caddr_t = function() {return T.__caddr_t;};
T.key_t = function() {return T.__key_t;};
T.ulong = function() {return T.u32;};
T.ushort = function() {return T.u16;};
T.uint = function() {return T.u32;};
T.int8_t = function() {return T.i32;};
T.int16_t = function() {return T.i32;};
T.int32_t = function() {return T.i32;};
T.int64_t = function() {return T.i32;};
T.u_int8_t = function() {return T.u32;};
T.u_int16_t = function() {return T.u32;};
T.u_int32_t = function() {return T.u32;};
T.u_int64_t = function() {return T.u32;};
T.register_t = function() {return T.i32;};
T.__sig_atomic_t = function() {return T.i32;};
T.__sigset_t = function() {return Struct('', {
    __val: ArrayType(T.u32, NaN /* primary_expression {
     _0: {
      _0: '(',
      _1: '',
      _2: multiplicative_expression {
       _0: constant {
        _0: '1024'
       },
       _1: [{
        _0: ' ',
        _1: {
         _0: '/',
         _1: ' ',
         _2: primary_expression {
          _0: {
           _0: '(',
           _1: '',
           _2: multiplicative_expression {
            _0: constant {
             _0: '8'
            },
            _1: [{
             _0: ' ',
             _1: {
              _0: '*',
              _1: ' ',
              _2: unary_expression {
               _0: {
                _0: 'sizeof',
                _1: ' ',
                _2: '(',
                _3: '',
                _4: type_name {
                 _0: specifier_qualifier_list {
                  type: 'T.u32'
                 }
                },
                _5: '',
                _6: ')'
               }
              }
             }
            }]
           },
           _3: '',
           _4: ')'
          }
         }
        }
       }]
      },
      _3: '',
      _4: ')'
     }
    } */)
});};
T.sigset_t = function() {return T.__sigset_t;};
T.suseconds_t = function() {return T.__suseconds_t;};
T.__fd_mask = function() {return T.i32;};
T.fd_set = function() {return Struct('', {
    __fds_bits: ArrayType(T.__fd_mask, NaN /* multiplicative_expression {
     _0: constant {
      _0: '1024'
     },
     _1: [{
      _0: ' ',
      _1: {
       _0: '/',
       _1: ' ',
       _2: primary_expression {
        _0: {
         _0: '(',
         _1: '',
         _2: multiplicative_expression {
          _0: constant {
           _0: '8'
          },
          _1: [{
           _0: ' ',
           _1: {
            _0: '*',
            _1: ' ',
            _2: cast_expression {
             _0: {
              _0: '(',
              _1: '',
              _2: type_name {
               _0: specifier_qualifier_list {
                type: 'T.i32'
               }
              },
              _3: '',
              _4: ')',
              _5: ' ',
              _6: unary_expression {
               _0: {
                _0: 'sizeof',
                _1: ' ',
                _2: primary_expression {
                 _0: {
                  _0: '(',
                  _1: '',
                  _2: primary_expression {
                   _0: '__fd_mask'
                  },
                  _3: '',
                  _4: ')'
                 }
                }
               }
              }
             }
            }
           }
          }]
         },
         _3: '',
         _4: ')'
        }
       }
      }
     }]
    } */)
});};
T.fd_mask = function() {return T.__fd_mask;};
T.blksize_t = function() {return T.__blksize_t;};
T.blkcnt_t = function() {return T.__blkcnt_t;};
T.fsblkcnt_t = function() {return T.__fsblkcnt_t;};
T.fsfilcnt_t = function() {return T.__fsfilcnt_t;};
T.__compar_fn_t = function() {return Pointer(Fn(T.i32, [[Pointer(null)], [Pointer(null)]]));};
T.useconds_t = function() {return T.__useconds_t;};
T.intptr_t = function() {return T.__intptr_t;};
T.socklen_t = function() {return T.__socklen_t;};
T.wint_t = function() {return T.u32;};
T.mbstate_t = function() {return T.__mbstate_t;};
T.wctype_t = function() {return T.u32;};
T.wctrans_t = function() {return Pointer(T.__int32_t, [['const']]);};
T.nfds_t = function() {return T.u32;};
T.sa_family_t = function() {return T.u16;};
T.GLenum = function() {return T.u32;};
T.GLboolean = function() {return T.u8;};
T.GLbitfield = function() {return T.u32;};
T.GLvoid = function() {return null;};
T.GLbyte = function() {return T.i8;};
T.GLshort = function() {return T.i16;};
T.GLint = function() {return T.i32;};
T.GLubyte = function() {return T.u8;};
T.GLushort = function() {return T.u16;};
T.GLuint = function() {return T.u32;};
T.GLsizei = function() {return T.i32;};
T.GLfloat = function() {return T.f32;};
T.GLclampf = function() {return T.f32;};
T.GLdouble = function() {return T.f64;};
T.GLclampd = function() {return T.f64;};
T.PFNGLDRAWRANGEELEMENTSPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices']]));};
T.PFNGLTEXIMAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXSUBIMAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYTEXSUBIMAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLBLENDCOLORPROC = function() {return Pointer(Fn(null, [[T.GLclampf, 'red'], [T.GLclampf, 'green'], [T.GLclampf, 'blue'], [T.GLclampf, 'alpha']]));};
T.PFNGLBLENDEQUATIONPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLACTIVETEXTUREPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture']]));};
T.PFNGLSAMPLECOVERAGEPROC = function() {return Pointer(Fn(null, [[T.GLclampf, 'value'], [T.GLboolean, 'invert']]));};
T.PFNGLCOMPRESSEDTEXIMAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXIMAGE2DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXIMAGE1DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE2DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE1DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETCOMPRESSEDTEXIMAGEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLACTIVETEXTUREARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture']]));};
T.PFNGLCLIENTACTIVETEXTUREARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture']]));};
T.PFNGLMULTITEXCOORD1DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's']]));};
T.PFNGLMULTITEXCOORD1DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLMULTITEXCOORD1FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's']]));};
T.PFNGLMULTITEXCOORD1FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLMULTITEXCOORD1IARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 's']]));};
T.PFNGLMULTITEXCOORD1IVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']]));};
T.PFNGLMULTITEXCOORD1SARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's']]));};
T.PFNGLMULTITEXCOORD1SVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLMULTITEXCOORD2DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't']]));};
T.PFNGLMULTITEXCOORD2DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLMULTITEXCOORD2FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't']]));};
T.PFNGLMULTITEXCOORD2FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLMULTITEXCOORD2IARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't']]));};
T.PFNGLMULTITEXCOORD2IVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']]));};
T.PFNGLMULTITEXCOORD2SARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't']]));};
T.PFNGLMULTITEXCOORD2SVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLMULTITEXCOORD3DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r']]));};
T.PFNGLMULTITEXCOORD3DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLMULTITEXCOORD3FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r']]));};
T.PFNGLMULTITEXCOORD3FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLMULTITEXCOORD3IARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r']]));};
T.PFNGLMULTITEXCOORD3IVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']]));};
T.PFNGLMULTITEXCOORD3SARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r']]));};
T.PFNGLMULTITEXCOORD3SVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLMULTITEXCOORD4DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r'], [T.GLdouble, 'q']]));};
T.PFNGLMULTITEXCOORD4DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLMULTITEXCOORD4FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'q']]));};
T.PFNGLMULTITEXCOORD4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLMULTITEXCOORD4IARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r'], [T.GLint, 'q']]));};
T.PFNGLMULTITEXCOORD4IVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']]));};
T.PFNGLMULTITEXCOORD4SARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r'], [T.GLshort, 'q']]));};
T.PFNGLMULTITEXCOORD4SVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']]));};
T.ptrdiff_t = function() {return T.i32;};
T.GLchar = function() {return T.char;};
T.GLintptr = function() {return T.ptrdiff_t;};
T.GLsizeiptr = function() {return T.ptrdiff_t;};
T.GLintptrARB = function() {return T.ptrdiff_t;};
T.GLsizeiptrARB = function() {return T.ptrdiff_t;};
T.GLcharARB = function() {return T.char;};
T.GLhandleARB = function() {return T.u32;};
T.GLhalfARB = function() {return T.u16;};
T.GLhalfNV = function() {return T.u16;};
T.uint8_t = function() {return T.u8;};
T.uint16_t = function() {return T.u16;};
T.uint32_t = function() {return T.u32;};
T.uint64_t = function() {return T.u64;};
T.int_least8_t = function() {return T.i8;};
T.int_least16_t = function() {return T.i16;};
T.int_least32_t = function() {return T.i32;};
T.int_least64_t = function() {return T.i64;};
T.uint_least8_t = function() {return T.u8;};
T.uint_least16_t = function() {return T.u16;};
T.uint_least32_t = function() {return T.u32;};
T.uint_least64_t = function() {return T.u64;};
T.int_fast8_t = function() {return T.i8;};
T.int_fast16_t = function() {return T.i32;};
T.int_fast32_t = function() {return T.i32;};
T.int_fast64_t = function() {return T.i64;};
T.uint_fast8_t = function() {return T.u8;};
T.uint_fast16_t = function() {return T.u32;};
T.uint_fast32_t = function() {return T.u32;};
T.uint_fast64_t = function() {return T.u64;};
T.uintptr_t = function() {return T.u32;};
T.intmax_t = function() {return T.i64;};
T.uintmax_t = function() {return T.u64;};
T.__gwchar_t = function() {return T.i32;};
T.imaxdiv_t = function() {return Struct('', {
    quot: T.i64,
    rem: T.i64
});};
T.GLint64EXT = function() {return T.int64_t;};
T.GLuint64EXT = function() {return T.uint64_t;};
T.GLint64 = function() {return T.int64_t;};
T.GLuint64 = function() {return T.uint64_t;};
T.GLsync = function() {return Pointer(Struct('__GLsync', null));};
T.GLDEBUGPROCARB = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLuint, 'id'], [T.GLenum, 'severity'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'message'], [Pointer(T.GLvoid), 'userParam']]));};
T.GLDEBUGPROCAMD = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'category'], [T.GLenum, 'severity'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'message'], [Pointer(T.GLvoid), 'userParam']]));};
T.GLDEBUGPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLuint, 'id'], [T.GLenum, 'severity'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'message'], [Pointer(T.GLvoid), 'userParam']]));};
T.GLvdpauSurfaceNV = function() {return T.GLintptr;};
T.PFNGLBLENDFUNCSEPARATEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'sfactorRGB'], [T.GLenum, 'dfactorRGB'], [T.GLenum, 'sfactorAlpha'], [T.GLenum, 'dfactorAlpha']]));};
T.PFNGLMULTIDRAWARRAYSPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLint), 'first'], [Pointer(T.GLsizei), 'count'], [T.GLsizei, 'drawcount']]));};
T.PFNGLMULTIDRAWELEMENTSPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLsizei), 'count'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'indices'], [T.GLsizei, 'drawcount']]));};
T.PFNGLPOINTPARAMETERFPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPOINTPARAMETERFVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLPOINTPARAMETERIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLPOINTPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLFOGCOORDFPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'coord']]));};
T.PFNGLFOGCOORDFVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'coord']]));};
T.PFNGLFOGCOORDDPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'coord']]));};
T.PFNGLFOGCOORDDVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'coord']]));};
T.PFNGLFOGCOORDPOINTERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLSECONDARYCOLOR3BPROC = function() {return Pointer(Fn(null, [[T.GLbyte, 'red'], [T.GLbyte, 'green'], [T.GLbyte, 'blue']]));};
T.PFNGLSECONDARYCOLOR3BVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLbyte), 'v']]));};
T.PFNGLSECONDARYCOLOR3DPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'red'], [T.GLdouble, 'green'], [T.GLdouble, 'blue']]));};
T.PFNGLSECONDARYCOLOR3DVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLSECONDARYCOLOR3FPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue']]));};
T.PFNGLSECONDARYCOLOR3FVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLSECONDARYCOLOR3IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'red'], [T.GLint, 'green'], [T.GLint, 'blue']]));};
T.PFNGLSECONDARYCOLOR3IVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLSECONDARYCOLOR3SPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'red'], [T.GLshort, 'green'], [T.GLshort, 'blue']]));};
T.PFNGLSECONDARYCOLOR3SVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLSECONDARYCOLOR3UBPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'red'], [T.GLubyte, 'green'], [T.GLubyte, 'blue']]));};
T.PFNGLSECONDARYCOLOR3UBVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLubyte), 'v']]));};
T.PFNGLSECONDARYCOLOR3UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'red'], [T.GLuint, 'green'], [T.GLuint, 'blue']]));};
T.PFNGLSECONDARYCOLOR3UIVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'v']]));};
T.PFNGLSECONDARYCOLOR3USPROC = function() {return Pointer(Fn(null, [[T.GLushort, 'red'], [T.GLushort, 'green'], [T.GLushort, 'blue']]));};
T.PFNGLSECONDARYCOLOR3USVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLushort), 'v']]));};
T.PFNGLSECONDARYCOLORPOINTERPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLWINDOWPOS2DPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLWINDOWPOS2DVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS2FPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLWINDOWPOS2FVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS2IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLWINDOWPOS2IVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS2SPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLWINDOWPOS2SVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLWINDOWPOS3DPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLWINDOWPOS3DVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS3FPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLWINDOWPOS3FVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS3IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLWINDOWPOS3IVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS3SPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLWINDOWPOS3SVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLGENQUERIESPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLDELETEQUERIESPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLISQUERYPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLBEGINQUERYPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id']]));};
T.PFNGLENDQUERYPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLGETQUERYIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETQUERYOBJECTIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETQUERYOBJECTUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLBINDBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'buffer']]));};
T.PFNGLDELETEBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'buffers']]));};
T.PFNGLGENBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'buffers']]));};
T.PFNGLISBUFFERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'buffer']]));};
T.PFNGLBUFFERDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data'], [T.GLenum, 'usage']]));};
T.PFNGLBUFFERSUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETBUFFERSUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLMAPBUFFERPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLenum, 'target'], [T.GLenum, 'access']]));};
T.PFNGLUNMAPBUFFERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'target']]));};
T.PFNGLGETBUFFERPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETBUFFERPOINTERVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']]));};
T.PFNGLBLENDEQUATIONSEPARATEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'modeRGB'], [T.GLenum, 'modeAlpha']]));};
T.PFNGLDRAWBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLenum), 'bufs']]));};
T.PFNGLSTENCILOPSEPARATEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'sfail'], [T.GLenum, 'dpfail'], [T.GLenum, 'dppass']]));};
T.PFNGLSTENCILFUNCSEPARATEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'func'], [T.GLint, 'ref'], [T.GLuint, 'mask']]));};
T.PFNGLSTENCILMASKSEPARATEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLuint, 'mask']]));};
T.PFNGLATTACHSHADERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'shader']]));};
T.PFNGLBINDATTRIBLOCATIONPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLCOMPILESHADERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader']]));};
T.PFNGLCREATEPROGRAMPROC = function() {return Pointer(Fn(T.GLuint, [[null]]));};
T.PFNGLCREATESHADERPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'type']]));};
T.PFNGLDELETEPROGRAMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program']]));};
T.PFNGLDELETESHADERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader']]));};
T.PFNGLDETACHSHADERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'shader']]));};
T.PFNGLDISABLEVERTEXATTRIBARRAYPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLENABLEVERTEXATTRIBARRAYPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLGETACTIVEATTRIBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETACTIVEUNIFORMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETATTACHEDSHADERSPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'maxCount'], [Pointer(T.GLsizei), 'count'], [Pointer(T.GLuint), 'obj']]));};
T.PFNGLGETATTRIBLOCATIONPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETPROGRAMIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMINFOLOGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'infoLog']]));};
T.PFNGLGETSHADERIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETSHADERINFOLOGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'infoLog']]));};
T.PFNGLGETSHADERSOURCEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'source']]));};
T.PFNGLGETUNIFORMLOCATIONPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETUNIFORMFVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETUNIFORMIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBDVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETVERTEXATTRIBFVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVERTEXATTRIBIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBPOINTERVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLISPROGRAMPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'program']]));};
T.PFNGLISSHADERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'shader']]));};
T.PFNGLLINKPROGRAMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program']]));};
T.PFNGLSHADERSOURCEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLchar)), 'string'], [Pointer(T.GLint), 'length']]));};
T.PFNGLUSEPROGRAMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program']]));};
T.PFNGLUNIFORM1FPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0']]));};
T.PFNGLUNIFORM2FPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1']]));};
T.PFNGLUNIFORM3FPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2']]));};
T.PFNGLUNIFORM4FPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLfloat, 'v3']]));};
T.PFNGLUNIFORM1IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0']]));};
T.PFNGLUNIFORM2IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1']]));};
T.PFNGLUNIFORM3IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2']]));};
T.PFNGLUNIFORM4IPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2'], [T.GLint, 'v3']]));};
T.PFNGLUNIFORM1FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM2FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM3FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM4FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM1IVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM2IVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM3IVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM4IVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORMMATRIX2FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX3FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX4FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLVALIDATEPROGRAMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program']]));};
T.PFNGLVERTEXATTRIB1DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXATTRIB1DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB1FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x']]));};
T.PFNGLVERTEXATTRIB1FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB1SPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x']]));};
T.PFNGLVERTEXATTRIB1SVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB2DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXATTRIB2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB2FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLVERTEXATTRIB2FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB2SPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLVERTEXATTRIB2SVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB3DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXATTRIB3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB3FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLVERTEXATTRIB3FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB3SPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLVERTEXATTRIB3SVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4NBVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIB4NIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIB4NSVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4NUBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLubyte, 'x'], [T.GLubyte, 'y'], [T.GLubyte, 'z'], [T.GLubyte, 'w']]));};
T.PFNGLVERTEXATTRIB4NUBVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIB4NUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIB4NUSVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLVERTEXATTRIB4BVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIB4DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXATTRIB4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB4FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLVERTEXATTRIB4FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB4IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIB4SPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']]));};
T.PFNGLVERTEXATTRIB4SVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4UBVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIB4UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIB4USVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLVERTEXATTRIBPOINTERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLUNIFORMMATRIX2X3FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX3X2FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX2X4FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX4X2FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX3X4FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX4X3FVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLCOLORMASKIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLboolean, 'r'], [T.GLboolean, 'g'], [T.GLboolean, 'b'], [T.GLboolean, 'a']]));};
T.PFNGLGETBOOLEANI_VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLboolean), 'data']]));};
T.PFNGLGETINTEGERI_VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'data']]));};
T.PFNGLENABLEIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLDISABLEIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLISENABLEDIPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLBEGINTRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'primitiveMode']]));};
T.PFNGLENDTRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLBINDBUFFERRANGEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLBINDBUFFERBASEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer']]));};
T.PFNGLTRANSFORMFEEDBACKVARYINGSPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLchar)), 'varyings'], [T.GLenum, 'bufferMode']]));};
T.PFNGLGETTRANSFORMFEEDBACKVARYINGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLsizei), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLCLAMPCOLORPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'clamp']]));};
T.PFNGLBEGINCONDITIONALRENDERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'mode']]));};
T.PFNGLENDCONDITIONALRENDERPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLVERTEXATTRIBIPOINTERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLGETVERTEXATTRIBIIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBIUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLVERTEXATTRIBI1IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x']]));};
T.PFNGLVERTEXATTRIBI2IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLVERTEXATTRIBI3IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLVERTEXATTRIBI4IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLVERTEXATTRIBI1UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x']]));};
T.PFNGLVERTEXATTRIBI2UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y']]));};
T.PFNGLVERTEXATTRIBI3UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z']]));};
T.PFNGLVERTEXATTRIBI4UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z'], [T.GLuint, 'w']]));};
T.PFNGLVERTEXATTRIBI1IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI2IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI3IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI4IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI1UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI2UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI3UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI4UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI4BVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIBI4SVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBI4UBVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIBI4USVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLGETUNIFORMUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLBINDFRAGDATALOCATIONPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'color'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETFRAGDATALOCATIONPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLUNIFORM1UIPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0']]));};
T.PFNGLUNIFORM2UIPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1']]));};
T.PFNGLUNIFORM3UIPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2']]));};
T.PFNGLUNIFORM4UIPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2'], [T.GLuint, 'v3']]));};
T.PFNGLUNIFORM1UIVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM2UIVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM3UIVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM4UIVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLTEXPARAMETERIIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLTEXPARAMETERIUIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETTEXPARAMETERIIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETTEXPARAMETERIUIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLCLEARBUFFERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'buffer'], [T.GLint, 'drawbuffer'], [Pointer(T.GLint), 'value']]));};
T.PFNGLCLEARBUFFERUIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'buffer'], [T.GLint, 'drawbuffer'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLCLEARBUFFERFVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'buffer'], [T.GLint, 'drawbuffer'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLCLEARBUFFERFIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'buffer'], [T.GLint, 'drawbuffer'], [T.GLfloat, 'depth'], [T.GLint, 'stencil']]));};
T.PFNGLGETSTRINGIPROC = function() {return Pointer(Fn(Pointer(T.GLubyte), [[T.GLenum, 'name'], [T.GLuint, 'index']]), [['const']]);};
T.PFNGLDRAWARRAYSINSTANCEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count'], [T.GLsizei, 'instancecount']]));};
T.PFNGLDRAWELEMENTSINSTANCEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLsizei, 'instancecount']]));};
T.PFNGLTEXBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer']]));};
T.PFNGLPRIMITIVERESTARTINDEXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLGETINTEGER64I_VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint64), 'data']]));};
T.PFNGLGETBUFFERPARAMETERI64VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint64), 'params']]));};
T.PFNGLFRAMEBUFFERTEXTUREPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLVERTEXATTRIBDIVISORPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'divisor']]));};
T.PFNGLMINSAMPLESHADINGPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'value']]));};
T.PFNGLBLENDEQUATIONIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'mode']]));};
T.PFNGLBLENDEQUATIONSEPARATEIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'modeRGB'], [T.GLenum, 'modeAlpha']]));};
T.PFNGLBLENDFUNCIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'src'], [T.GLenum, 'dst']]));};
T.PFNGLBLENDFUNCSEPARATEIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'srcRGB'], [T.GLenum, 'dstRGB'], [T.GLenum, 'srcAlpha'], [T.GLenum, 'dstAlpha']]));};
T.PFNGLLOADTRANSPOSEMATRIXFARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'm']]));};
T.PFNGLLOADTRANSPOSEMATRIXDARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'm']]));};
T.PFNGLMULTTRANSPOSEMATRIXFARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'm']]));};
T.PFNGLMULTTRANSPOSEMATRIXDARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'm']]));};
T.PFNGLSAMPLECOVERAGEARBPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'value'], [T.GLboolean, 'invert']]));};
T.PFNGLCOMPRESSEDTEXIMAGE3DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXIMAGE2DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXIMAGE1DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE3DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE2DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOMPRESSEDTEXSUBIMAGE1DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETCOMPRESSEDTEXIMAGEARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLPOINTPARAMETERFARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPOINTPARAMETERFVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLWEIGHTBVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLbyte), 'weights']]));};
T.PFNGLWEIGHTSVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLshort), 'weights']]));};
T.PFNGLWEIGHTIVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLint), 'weights']]));};
T.PFNGLWEIGHTFVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLfloat), 'weights']]));};
T.PFNGLWEIGHTDVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLdouble), 'weights']]));};
T.PFNGLWEIGHTUBVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLubyte), 'weights']]));};
T.PFNGLWEIGHTUSVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLushort), 'weights']]));};
T.PFNGLWEIGHTUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLuint), 'weights']]));};
T.PFNGLWEIGHTPOINTERARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLVERTEXBLENDARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'count']]));};
T.PFNGLCURRENTPALETTEMATRIXARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'index']]));};
T.PFNGLMATRIXINDEXUBVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLubyte), 'indices']]));};
T.PFNGLMATRIXINDEXUSVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLushort), 'indices']]));};
T.PFNGLMATRIXINDEXUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [Pointer(T.GLuint), 'indices']]));};
T.PFNGLMATRIXINDEXPOINTERARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLWINDOWPOS2DARBPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLWINDOWPOS2DVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS2FARBPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLWINDOWPOS2FVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS2IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLWINDOWPOS2IVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS2SARBPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLWINDOWPOS2SVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLWINDOWPOS3DARBPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLWINDOWPOS3DVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS3FARBPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLWINDOWPOS3FVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS3IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLWINDOWPOS3IVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS3SARBPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLWINDOWPOS3SVARBPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB1DARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXATTRIB1DVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB1FARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x']]));};
T.PFNGLVERTEXATTRIB1FVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB1SARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x']]));};
T.PFNGLVERTEXATTRIB1SVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB2DARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXATTRIB2DVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB2FARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLVERTEXATTRIB2FVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB2SARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLVERTEXATTRIB2SVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB3DARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXATTRIB3DVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB3FARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLVERTEXATTRIB3FVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB3SARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLVERTEXATTRIB3SVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4NBVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIB4NIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIB4NSVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4NUBARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLubyte, 'x'], [T.GLubyte, 'y'], [T.GLubyte, 'z'], [T.GLubyte, 'w']]));};
T.PFNGLVERTEXATTRIB4NUBVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIB4NUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIB4NUSVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLVERTEXATTRIB4BVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIB4DARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXATTRIB4DVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB4FARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLVERTEXATTRIB4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB4IVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIB4SARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']]));};
T.PFNGLVERTEXATTRIB4SVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4UBVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIB4UIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIB4USVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLVERTEXATTRIBPOINTERARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLENABLEVERTEXATTRIBARRAYARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLDISABLEVERTEXATTRIBARRAYARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLPROGRAMSTRINGARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLsizei, 'len'], [Pointer(T.GLvoid), 'string']]));};
T.PFNGLBINDPROGRAMARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'program']]));};
T.PFNGLDELETEPROGRAMSARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs']]));};
T.PFNGLGENPROGRAMSARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs']]));};
T.PFNGLPROGRAMENVPARAMETER4DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLPROGRAMENVPARAMETER4DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLPROGRAMENVPARAMETER4FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLPROGRAMENVPARAMETER4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETER4DARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLPROGRAMLOCALPARAMETER4DVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETER4FARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLPROGRAMLOCALPARAMETER4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPROGRAMENVPARAMETERDVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETPROGRAMENVPARAMETERFVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPROGRAMLOCALPARAMETERDVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETPROGRAMLOCALPARAMETERFVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPROGRAMIVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMSTRINGARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLvoid), 'string']]));};
T.PFNGLGETVERTEXATTRIBDVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETVERTEXATTRIBFVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVERTEXATTRIBIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBPOINTERVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLISPROGRAMARBPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'program']]));};
T.PFNGLBINDBUFFERARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'buffer']]));};
T.PFNGLDELETEBUFFERSARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'buffers']]));};
T.PFNGLGENBUFFERSARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'buffers']]));};
T.PFNGLISBUFFERARBPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'buffer']]));};
T.PFNGLBUFFERDATAARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizeiptrARB, 'size'], [Pointer(T.GLvoid), 'data'], [T.GLenum, 'usage']]));};
T.PFNGLBUFFERSUBDATAARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptrARB, 'offset'], [T.GLsizeiptrARB, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETBUFFERSUBDATAARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptrARB, 'offset'], [T.GLsizeiptrARB, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLMAPBUFFERARBPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLenum, 'target'], [T.GLenum, 'access']]));};
T.PFNGLUNMAPBUFFERARBPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'target']]));};
T.PFNGLGETBUFFERPARAMETERIVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETBUFFERPOINTERVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']]));};
T.PFNGLGENQUERIESARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLDELETEQUERIESARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLISQUERYARBPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLBEGINQUERYARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id']]));};
T.PFNGLENDQUERYARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLGETQUERYIVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETQUERYOBJECTIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETQUERYOBJECTUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLDELETEOBJECTARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'obj']]));};
T.PFNGLGETHANDLEARBPROC = function() {return Pointer(Fn(T.GLhandleARB, [[T.GLenum, 'pname']]));};
T.PFNGLDETACHOBJECTARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'containerObj'], [T.GLhandleARB, 'attachedObj']]));};
T.PFNGLCREATESHADEROBJECTARBPROC = function() {return Pointer(Fn(T.GLhandleARB, [[T.GLenum, 'shaderType']]));};
T.PFNGLSHADERSOURCEARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'shaderObj'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLcharARB)), 'string'], [Pointer(T.GLint), 'length']]));};
T.PFNGLCOMPILESHADERARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'shaderObj']]));};
T.PFNGLCREATEPROGRAMOBJECTARBPROC = function() {return Pointer(Fn(T.GLhandleARB, [[null]]));};
T.PFNGLATTACHOBJECTARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'containerObj'], [T.GLhandleARB, 'obj']]));};
T.PFNGLLINKPROGRAMARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj']]));};
T.PFNGLUSEPROGRAMOBJECTARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj']]));};
T.PFNGLVALIDATEPROGRAMARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj']]));};
T.PFNGLUNIFORM1FARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0']]));};
T.PFNGLUNIFORM2FARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1']]));};
T.PFNGLUNIFORM3FARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2']]));};
T.PFNGLUNIFORM4FARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLfloat, 'v3']]));};
T.PFNGLUNIFORM1IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0']]));};
T.PFNGLUNIFORM2IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1']]));};
T.PFNGLUNIFORM3IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2']]));};
T.PFNGLUNIFORM4IARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2'], [T.GLint, 'v3']]));};
T.PFNGLUNIFORM1FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM2FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM3FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORM1IVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM2IVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM3IVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORM4IVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLUNIFORMMATRIX2FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX3FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLUNIFORMMATRIX4FVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLGETOBJECTPARAMETERFVARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'obj'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETOBJECTPARAMETERIVARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'obj'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETINFOLOGARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'obj'], [T.GLsizei, 'maxLength'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLcharARB), 'infoLog']]));};
T.PFNGLGETATTACHEDOBJECTSARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'containerObj'], [T.GLsizei, 'maxCount'], [Pointer(T.GLsizei), 'count'], [Pointer(T.GLhandleARB), 'obj']]));};
T.PFNGLGETUNIFORMLOCATIONARBPROC = function() {return Pointer(Fn(T.GLint, [[T.GLhandleARB, 'programObj'], [Pointer(T.GLcharARB), 'name']]));};
T.PFNGLGETACTIVEUNIFORMARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj'], [T.GLuint, 'index'], [T.GLsizei, 'maxLength'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLcharARB), 'name']]));};
T.PFNGLGETUNIFORMFVARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj'], [T.GLint, 'location'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETUNIFORMIVARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj'], [T.GLint, 'location'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETSHADERSOURCEARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'obj'], [T.GLsizei, 'maxLength'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLcharARB), 'source']]));};
T.PFNGLBINDATTRIBLOCATIONARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj'], [T.GLuint, 'index'], [Pointer(T.GLcharARB), 'name']]));};
T.PFNGLGETACTIVEATTRIBARBPROC = function() {return Pointer(Fn(null, [[T.GLhandleARB, 'programObj'], [T.GLuint, 'index'], [T.GLsizei, 'maxLength'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLcharARB), 'name']]));};
T.PFNGLGETATTRIBLOCATIONARBPROC = function() {return Pointer(Fn(T.GLint, [[T.GLhandleARB, 'programObj'], [Pointer(T.GLcharARB), 'name']]));};
T.PFNGLDRAWBUFFERSARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLenum), 'bufs']]));};
T.PFNGLCLAMPCOLORARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'clamp']]));};
T.PFNGLDRAWARRAYSINSTANCEDARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count'], [T.GLsizei, 'primcount']]));};
T.PFNGLDRAWELEMENTSINSTANCEDARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLsizei, 'primcount']]));};
T.PFNGLISRENDERBUFFERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'renderbuffer']]));};
T.PFNGLBINDRENDERBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLDELETERENDERBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'renderbuffers']]));};
T.PFNGLGENRENDERBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'renderbuffers']]));};
T.PFNGLRENDERBUFFERSTORAGEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETRENDERBUFFERPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLISFRAMEBUFFERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'framebuffer']]));};
T.PFNGLBINDFRAMEBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'framebuffer']]));};
T.PFNGLDELETEFRAMEBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'framebuffers']]));};
T.PFNGLGENFRAMEBUFFERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'framebuffers']]));};
T.PFNGLCHECKFRAMEBUFFERSTATUSPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLenum, 'target']]));};
T.PFNGLFRAMEBUFFERTEXTURE1DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURE2DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'zoffset']]));};
T.PFNGLFRAMEBUFFERRENDERBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'renderbuffertarget'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGENERATEMIPMAPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLBLITFRAMEBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLint, 'srcX0'], [T.GLint, 'srcY0'], [T.GLint, 'srcX1'], [T.GLint, 'srcY1'], [T.GLint, 'dstX0'], [T.GLint, 'dstY0'], [T.GLint, 'dstX1'], [T.GLint, 'dstY1'], [T.GLbitfield, 'mask'], [T.GLenum, 'filter']]));};
T.PFNGLRENDERBUFFERSTORAGEMULTISAMPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLFRAMEBUFFERTEXTURELAYERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'layer']]));};
T.PFNGLPROGRAMPARAMETERIARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'pname'], [T.GLint, 'value']]));};
T.PFNGLFRAMEBUFFERTEXTUREARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURELAYERARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'layer']]));};
T.PFNGLFRAMEBUFFERTEXTUREFACEARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLenum, 'face']]));};
T.PFNGLVERTEXATTRIBDIVISORARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'divisor']]));};
T.PFNGLMAPBUFFERRANGEPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLenum, 'target'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'length'], [T.GLbitfield, 'access']]));};
T.PFNGLFLUSHMAPPEDBUFFERRANGEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'length']]));};
T.PFNGLTEXBUFFERARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer']]));};
T.PFNGLBINDVERTEXARRAYPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'array']]));};
T.PFNGLDELETEVERTEXARRAYSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'arrays']]));};
T.PFNGLGENVERTEXARRAYSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'arrays']]));};
T.PFNGLISVERTEXARRAYPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'array']]));};
T.PFNGLGETUNIFORMINDICESPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'uniformCount'], [Pointer(Pointer(T.GLchar)), 'uniformNames'], [Pointer(T.GLuint), 'uniformIndices']]));};
T.PFNGLGETACTIVEUNIFORMSIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'uniformCount'], [Pointer(T.GLuint), 'uniformIndices'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETACTIVEUNIFORMNAMEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'uniformIndex'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'uniformName']]));};
T.PFNGLGETUNIFORMBLOCKINDEXPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'uniformBlockName']]));};
T.PFNGLGETACTIVEUNIFORMBLOCKIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'uniformBlockIndex'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETACTIVEUNIFORMBLOCKNAMEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'uniformBlockIndex'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'uniformBlockName']]));};
T.PFNGLUNIFORMBLOCKBINDINGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'uniformBlockIndex'], [T.GLuint, 'uniformBlockBinding']]));};
T.PFNGLCOPYBUFFERSUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'readTarget'], [T.GLenum, 'writeTarget'], [T.GLintptr, 'readOffset'], [T.GLintptr, 'writeOffset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLDRAWELEMENTSBASEVERTEXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLint, 'basevertex']]));};
T.PFNGLDRAWRANGEELEMENTSBASEVERTEXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLint, 'basevertex']]));};
T.PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLsizei, 'instancecount'], [T.GLint, 'basevertex']]));};
T.PFNGLMULTIDRAWELEMENTSBASEVERTEXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLsizei), 'count'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'indices'], [T.GLsizei, 'drawcount'], [Pointer(T.GLint), 'basevertex']]));};
T.PFNGLPROVOKINGVERTEXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLFENCESYNCPROC = function() {return Pointer(Fn(T.GLsync, [[T.GLenum, 'condition'], [T.GLbitfield, 'flags']]));};
T.PFNGLISSYNCPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLsync, 'sync']]));};
T.PFNGLDELETESYNCPROC = function() {return Pointer(Fn(null, [[T.GLsync, 'sync']]));};
T.PFNGLCLIENTWAITSYNCPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLsync, 'sync'], [T.GLbitfield, 'flags'], [T.GLuint64, 'timeout']]));};
T.PFNGLWAITSYNCPROC = function() {return Pointer(Fn(null, [[T.GLsync, 'sync'], [T.GLbitfield, 'flags'], [T.GLuint64, 'timeout']]));};
T.PFNGLGETINTEGER64VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint64), 'params']]));};
T.PFNGLGETSYNCIVPROC = function() {return Pointer(Fn(null, [[T.GLsync, 'sync'], [T.GLenum, 'pname'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'values']]));};
T.PFNGLTEXIMAGE2DMULTISAMPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLint, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLTEXIMAGE3DMULTISAMPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLint, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLGETMULTISAMPLEFVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'val']]));};
T.PFNGLSAMPLEMASKIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLbitfield, 'mask']]));};
T.PFNGLBLENDEQUATIONIARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'mode']]));};
T.PFNGLBLENDEQUATIONSEPARATEIARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'modeRGB'], [T.GLenum, 'modeAlpha']]));};
T.PFNGLBLENDFUNCIARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'src'], [T.GLenum, 'dst']]));};
T.PFNGLBLENDFUNCSEPARATEIARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'srcRGB'], [T.GLenum, 'dstRGB'], [T.GLenum, 'srcAlpha'], [T.GLenum, 'dstAlpha']]));};
T.PFNGLMINSAMPLESHADINGARBPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'value']]));};
T.PFNGLNAMEDSTRINGARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLint, 'namelen'], [Pointer(T.GLchar), 'name'], [T.GLint, 'stringlen'], [Pointer(T.GLchar), 'string']]));};
T.PFNGLDELETENAMEDSTRINGARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'namelen'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLCOMPILESHADERINCLUDEARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'shader'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLchar)), 'path'], [Pointer(T.GLint), 'length']]));};
T.PFNGLISNAMEDSTRINGARBPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLint, 'namelen'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETNAMEDSTRINGARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'namelen'], [Pointer(T.GLchar), 'name'], [T.GLsizei, 'bufSize'], [Pointer(T.GLint), 'stringlen'], [Pointer(T.GLchar), 'string']]));};
T.PFNGLGETNAMEDSTRINGIVARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'namelen'], [Pointer(T.GLchar), 'name'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLBINDFRAGDATALOCATIONINDEXEDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'colorNumber'], [T.GLuint, 'index'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETFRAGDATAINDEXPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGENSAMPLERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'count'], [Pointer(T.GLuint), 'samplers']]));};
T.PFNGLDELETESAMPLERSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'count'], [Pointer(T.GLuint), 'samplers']]));};
T.PFNGLISSAMPLERPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'sampler']]));};
T.PFNGLBINDSAMPLERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'unit'], [T.GLuint, 'sampler']]));};
T.PFNGLSAMPLERPARAMETERIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLSAMPLERPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'param']]));};
T.PFNGLSAMPLERPARAMETERFPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLSAMPLERPARAMETERFVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'param']]));};
T.PFNGLSAMPLERPARAMETERIIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'param']]));};
T.PFNGLSAMPLERPARAMETERIUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'param']]));};
T.PFNGLGETSAMPLERPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETSAMPLERPARAMETERIIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETSAMPLERPARAMETERFVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETSAMPLERPARAMETERIUIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'sampler'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLQUERYCOUNTERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'target']]));};
T.PFNGLGETQUERYOBJECTI64VPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint64), 'params']]));};
T.PFNGLGETQUERYOBJECTUI64VPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLuint64), 'params']]));};
T.PFNGLVERTEXP2UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXP2UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLVERTEXP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLVERTEXP4UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXP4UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLTEXCOORDP1UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLTEXCOORDP1UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLTEXCOORDP2UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLTEXCOORDP2UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLTEXCOORDP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLTEXCOORDP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLTEXCOORDP4UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLTEXCOORDP4UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLMULTITEXCOORDP1UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLMULTITEXCOORDP1UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLMULTITEXCOORDP2UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLMULTITEXCOORDP2UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLMULTITEXCOORDP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLMULTITEXCOORDP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLMULTITEXCOORDP4UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLMULTITEXCOORDP4UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texture'], [T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLNORMALP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'coords']]));};
T.PFNGLNORMALP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'coords']]));};
T.PFNGLCOLORP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'color']]));};
T.PFNGLCOLORP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'color']]));};
T.PFNGLCOLORP4UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'color']]));};
T.PFNGLCOLORP4UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'color']]));};
T.PFNGLSECONDARYCOLORP3UIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'color']]));};
T.PFNGLSECONDARYCOLORP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLuint), 'color']]));};
T.PFNGLVERTEXATTRIBP1UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXATTRIBP1UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLVERTEXATTRIBP2UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXATTRIBP2UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLVERTEXATTRIBP3UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXATTRIBP3UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLVERTEXATTRIBP4UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'value']]));};
T.PFNGLVERTEXATTRIBP4UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLDRAWARRAYSINDIRECTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLvoid), 'indirect']]));};
T.PFNGLDRAWELEMENTSINDIRECTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indirect']]));};
T.PFNGLUNIFORM1DPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLdouble, 'x']]));};
T.PFNGLUNIFORM2DPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLUNIFORM3DPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLUNIFORM4DPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLUNIFORM1DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORM2DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORM3DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORM4DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX2DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX3DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX4DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX2X3DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX2X4DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX3X2DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX3X4DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX4X2DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLUNIFORMMATRIX4X3DVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLGETUNIFORMDVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETSUBROUTINEUNIFORMLOCATIONPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETSUBROUTINEINDEXPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETACTIVESUBROUTINEUNIFORMIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'values']]));};
T.PFNGLGETACTIVESUBROUTINEUNIFORMNAMEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [T.GLuint, 'index'], [T.GLsizei, 'bufsize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETACTIVESUBROUTINENAMEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [T.GLuint, 'index'], [T.GLsizei, 'bufsize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLUNIFORMSUBROUTINESUIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'shadertype'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'indices']]));};
T.PFNGLGETUNIFORMSUBROUTINEUIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'shadertype'], [T.GLint, 'location'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETPROGRAMSTAGEIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'shadertype'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'values']]));};
T.PFNGLPATCHPARAMETERIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'value']]));};
T.PFNGLPATCHPARAMETERFVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'values']]));};
T.PFNGLBINDTRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id']]));};
T.PFNGLDELETETRANSFORMFEEDBACKSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLGENTRANSFORMFEEDBACKSPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLISTRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLPAUSETRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLRESUMETRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLDRAWTRANSFORMFEEDBACKPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'id']]));};
T.PFNGLDRAWTRANSFORMFEEDBACKSTREAMPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'id'], [T.GLuint, 'stream']]));};
T.PFNGLBEGINQUERYINDEXEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'id']]));};
T.PFNGLENDQUERYINDEXEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLGETQUERYINDEXEDIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLRELEASESHADERCOMPILERPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLSHADERBINARYPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'count'], [Pointer(T.GLuint), 'shaders'], [T.GLenum, 'binaryformat'], [Pointer(T.GLvoid), 'binary'], [T.GLsizei, 'length']]));};
T.PFNGLGETSHADERPRECISIONFORMATPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'shadertype'], [T.GLenum, 'precisiontype'], [Pointer(T.GLint), 'range'], [Pointer(T.GLint), 'precision']]));};
T.PFNGLDEPTHRANGEFPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'n'], [T.GLfloat, 'f']]));};
T.PFNGLCLEARDEPTHFPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'd']]));};
T.PFNGLGETPROGRAMBINARYPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLenum), 'binaryFormat'], [Pointer(T.GLvoid), 'binary']]));};
T.PFNGLPROGRAMBINARYPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'binaryFormat'], [Pointer(T.GLvoid), 'binary'], [T.GLsizei, 'length']]));};
T.PFNGLPROGRAMPARAMETERIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'pname'], [T.GLint, 'value']]));};
T.PFNGLUSEPROGRAMSTAGESPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline'], [T.GLbitfield, 'stages'], [T.GLuint, 'program']]));};
T.PFNGLACTIVESHADERPROGRAMPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline'], [T.GLuint, 'program']]));};
T.PFNGLCREATESHADERPROGRAMVPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'type'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLchar)), 'strings']]));};
T.PFNGLBINDPROGRAMPIPELINEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline']]));};
T.PFNGLDELETEPROGRAMPIPELINESPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'pipelines']]));};
T.PFNGLGENPROGRAMPIPELINESPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'pipelines']]));};
T.PFNGLISPROGRAMPIPELINEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'pipeline']]));};
T.PFNGLGETPROGRAMPIPELINEIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMUNIFORM1IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0']]));};
T.PFNGLPROGRAMUNIFORM1IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM1FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0']]));};
T.PFNGLPROGRAMUNIFORM1FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM1DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'v0']]));};
T.PFNGLPROGRAMUNIFORM1DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM1UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0']]));};
T.PFNGLPROGRAMUNIFORM1UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM2IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1']]));};
T.PFNGLPROGRAMUNIFORM2IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM2FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1']]));};
T.PFNGLPROGRAMUNIFORM2FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM2DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'v0'], [T.GLdouble, 'v1']]));};
T.PFNGLPROGRAMUNIFORM2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM2UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1']]));};
T.PFNGLPROGRAMUNIFORM2UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM3IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2']]));};
T.PFNGLPROGRAMUNIFORM3IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM3FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2']]));};
T.PFNGLPROGRAMUNIFORM3FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM3DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'v0'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2']]));};
T.PFNGLPROGRAMUNIFORM3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM3UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2']]));};
T.PFNGLPROGRAMUNIFORM3UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM4IPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2'], [T.GLint, 'v3']]));};
T.PFNGLPROGRAMUNIFORM4IVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM4FPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLfloat, 'v3']]));};
T.PFNGLPROGRAMUNIFORM4FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM4DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'v0'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2'], [T.GLdouble, 'v3']]));};
T.PFNGLPROGRAMUNIFORM4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM4UIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2'], [T.GLuint, 'v3']]));};
T.PFNGLPROGRAMUNIFORM4UIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X3FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X2FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X4FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X2FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X4FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X3FVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLVALIDATEPROGRAMPIPELINEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline']]));};
T.PFNGLGETPROGRAMPIPELINEINFOLOGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'pipeline'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'infoLog']]));};
T.PFNGLVERTEXATTRIBL1DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXATTRIBL2DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXATTRIBL3DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXATTRIBL4DPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXATTRIBL1DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL2DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL3DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL4DVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBLPOINTERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLGETVERTEXATTRIBLDVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLVIEWPORTARRAYVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'first'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVIEWPORTINDEXEDFPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'w'], [T.GLfloat, 'h']]));};
T.PFNGLVIEWPORTINDEXEDFVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLSCISSORARRAYVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'first'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'v']]));};
T.PFNGLSCISSORINDEXEDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'left'], [T.GLint, 'bottom'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLSCISSORINDEXEDVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLDEPTHRANGEARRAYVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'first'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLDEPTHRANGEINDEXEDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'n'], [T.GLdouble, 'f']]));};
T.PFNGLGETFLOATI_VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'data']]));};
T.PFNGLGETDOUBLEI_VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'data']]));};
T.PFNGLCREATESYNCFROMCLEVENTARBPROC = function() {return Pointer(Fn(T.GLsync, [[Pointer(Struct('_cl_context', null)), 'context'], [Pointer(Struct('_cl_event', null)), 'event'], [T.GLbitfield, 'flags']]));};
T.PFNGLDEBUGMESSAGECONTROLARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLenum, 'severity'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'ids'], [T.GLboolean, 'enabled']]));};
T.PFNGLDEBUGMESSAGEINSERTARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLuint, 'id'], [T.GLenum, 'severity'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'buf']]));};
T.PFNGLDEBUGMESSAGECALLBACKARBPROC = function() {return Pointer(Fn(null, [[T.GLDEBUGPROCARB, 'callback'], [Pointer(T.GLvoid), 'userParam']]));};
T.PFNGLGETDEBUGMESSAGELOGARBPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'count'], [T.GLsizei, 'bufsize'], [Pointer(T.GLenum), 'sources'], [Pointer(T.GLenum), 'types'], [Pointer(T.GLuint), 'ids'], [Pointer(T.GLenum), 'severities'], [Pointer(T.GLsizei), 'lengths'], [Pointer(T.GLchar), 'messageLog']]));};
T.PFNGLGETGRAPHICSRESETSTATUSARBPROC = function() {return Pointer(Fn(T.GLenum, [[null]]));};
T.PFNGLGETNMAPDVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [T.GLsizei, 'bufSize'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLGETNMAPFVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [T.GLsizei, 'bufSize'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLGETNMAPIVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [T.GLsizei, 'bufSize'], [Pointer(T.GLint), 'v']]));};
T.PFNGLGETNPIXELMAPFVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'bufSize'], [Pointer(T.GLfloat), 'values']]));};
T.PFNGLGETNPIXELMAPUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'bufSize'], [Pointer(T.GLuint), 'values']]));};
T.PFNGLGETNPIXELMAPUSVARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'bufSize'], [Pointer(T.GLushort), 'values']]));};
T.PFNGLGETNPOLYGONSTIPPLEARBPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'bufSize'], [Pointer(T.GLubyte), 'pattern']]));};
T.PFNGLGETNCOLORTABLEARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'table']]));};
T.PFNGLGETNCONVOLUTIONFILTERARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'image']]));};
T.PFNGLGETNSEPARABLEFILTERARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'rowBufSize'], [Pointer(T.GLvoid), 'row'], [T.GLsizei, 'columnBufSize'], [Pointer(T.GLvoid), 'column'], [Pointer(T.GLvoid), 'span']]));};
T.PFNGLGETNHISTOGRAMARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'values']]));};
T.PFNGLGETNMINMAXARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'values']]));};
T.PFNGLGETNTEXIMAGEARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLREADNPIXELSARBPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETNCOMPRESSEDTEXIMAGEARBPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'lod'], [T.GLsizei, 'bufSize'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLGETNUNIFORMFVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'bufSize'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETNUNIFORMIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'bufSize'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETNUNIFORMUIVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'bufSize'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETNUNIFORMDVARBPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'bufSize'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLDRAWARRAYSINSTANCEDBASEINSTANCEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count'], [T.GLsizei, 'instancecount'], [T.GLuint, 'baseinstance']]));};
T.PFNGLDRAWELEMENTSINSTANCEDBASEINSTANCEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(null), 'indices'], [T.GLsizei, 'instancecount'], [T.GLuint, 'baseinstance']]));};
T.PFNGLDRAWELEMENTSINSTANCEDBASEVERTEXBASEINSTANCEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(null), 'indices'], [T.GLsizei, 'instancecount'], [T.GLint, 'basevertex'], [T.GLuint, 'baseinstance']]));};
T.PFNGLDRAWTRANSFORMFEEDBACKINSTANCEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'id'], [T.GLsizei, 'instancecount']]));};
T.PFNGLDRAWTRANSFORMFEEDBACKSTREAMINSTANCEDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'id'], [T.GLuint, 'stream'], [T.GLsizei, 'instancecount']]));};
T.PFNGLGETINTERNALFORMATIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLenum, 'pname'], [T.GLsizei, 'bufSize'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETACTIVEATOMICCOUNTERBUFFERIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'bufferIndex'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLBINDIMAGETEXTUREPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'unit'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLboolean, 'layered'], [T.GLint, 'layer'], [T.GLenum, 'access'], [T.GLenum, 'format']]));};
T.PFNGLMEMORYBARRIERPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'barriers']]));};
T.PFNGLTEXSTORAGE1DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width']]));};
T.PFNGLTEXSTORAGE2DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLTEXSTORAGE3DPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth']]));};
T.PFNGLTEXTURESTORAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width']]));};
T.PFNGLTEXTURESTORAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLTEXTURESTORAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'levels'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth']]));};
T.PFNGLDEBUGMESSAGECONTROLPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLenum, 'severity'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'ids'], [T.GLboolean, 'enabled']]));};
T.PFNGLDEBUGMESSAGEINSERTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLenum, 'type'], [T.GLuint, 'id'], [T.GLenum, 'severity'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'buf']]));};
T.PFNGLDEBUGMESSAGECALLBACKPROC = function() {return Pointer(Fn(null, [[T.GLDEBUGPROC, 'callback'], [Pointer(null), 'userParam']]));};
T.PFNGLGETDEBUGMESSAGELOGPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'count'], [T.GLsizei, 'bufsize'], [Pointer(T.GLenum), 'sources'], [Pointer(T.GLenum), 'types'], [Pointer(T.GLuint), 'ids'], [Pointer(T.GLenum), 'severities'], [Pointer(T.GLsizei), 'lengths'], [Pointer(T.GLchar), 'messageLog']]));};
T.PFNGLPUSHDEBUGGROUPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'source'], [T.GLuint, 'id'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'message']]));};
T.PFNGLPOPDEBUGGROUPPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLOBJECTLABELPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'identifier'], [T.GLuint, 'name'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'label']]));};
T.PFNGLGETOBJECTLABELPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'identifier'], [T.GLuint, 'name'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'label']]));};
T.PFNGLOBJECTPTRLABELPROC = function() {return Pointer(Fn(null, [[Pointer(null), 'ptr'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'label']]));};
T.PFNGLGETOBJECTPTRLABELPROC = function() {return Pointer(Fn(null, [[Pointer(null), 'ptr'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'label']]));};
T.PFNGLCLEARBUFFERDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(null), 'data']]));};
T.PFNGLCLEARBUFFERSUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(null), 'data']]));};
T.PFNGLCLEARNAMEDBUFFERDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'internalformat'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(null), 'data']]));};
T.PFNGLCLEARNAMEDBUFFERSUBDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'internalformat'], [T.GLenum, 'format'], [T.GLenum, 'type'], [T.GLsizeiptr, 'offset'], [T.GLsizeiptr, 'size'], [Pointer(null), 'data']]));};
T.PFNGLDISPATCHCOMPUTEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'num_groups_x'], [T.GLuint, 'num_groups_y'], [T.GLuint, 'num_groups_z']]));};
T.PFNGLDISPATCHCOMPUTEINDIRECTPROC = function() {return Pointer(Fn(null, [[T.GLintptr, 'indirect']]));};
T.PFNGLCOPYIMAGESUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'srcName'], [T.GLenum, 'srcTarget'], [T.GLint, 'srcLevel'], [T.GLint, 'srcX'], [T.GLint, 'srcY'], [T.GLint, 'srcZ'], [T.GLuint, 'dstName'], [T.GLenum, 'dstTarget'], [T.GLint, 'dstLevel'], [T.GLint, 'dstX'], [T.GLint, 'dstY'], [T.GLint, 'dstZ'], [T.GLsizei, 'srcWidth'], [T.GLsizei, 'srcHeight'], [T.GLsizei, 'srcDepth']]));};
T.PFNGLTEXTUREVIEWPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLuint, 'origtexture'], [T.GLenum, 'internalformat'], [T.GLuint, 'minlevel'], [T.GLuint, 'numlevels'], [T.GLuint, 'minlayer'], [T.GLuint, 'numlayers']]));};
T.PFNGLBINDVERTEXBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'bindingindex'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizei, 'stride']]));};
T.PFNGLVERTEXATTRIBFORMATPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXATTRIBIFORMATPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXATTRIBLFORMATPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXATTRIBBINDINGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'attribindex'], [T.GLuint, 'bindingindex']]));};
T.PFNGLVERTEXBINDINGDIVISORPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'bindingindex'], [T.GLuint, 'divisor']]));};
T.PFNGLVERTEXARRAYBINDVERTEXBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'bindingindex'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizei, 'stride']]));};
T.PFNGLVERTEXARRAYVERTEXATTRIBFORMATEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXARRAYVERTEXATTRIBIFORMATEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXARRAYVERTEXATTRIBLFORMATEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'attribindex'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLuint, 'relativeoffset']]));};
T.PFNGLVERTEXARRAYVERTEXATTRIBBINDINGEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'attribindex'], [T.GLuint, 'bindingindex']]));};
T.PFNGLVERTEXARRAYVERTEXBINDINGDIVISOREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'bindingindex'], [T.GLuint, 'divisor']]));};
T.PFNGLFRAMEBUFFERPARAMETERIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLGETFRAMEBUFFERPARAMETERIVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLNAMEDFRAMEBUFFERPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLGETNAMEDFRAMEBUFFERPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETINTERNALFORMATI64VPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLenum, 'pname'], [T.GLsizei, 'bufSize'], [Pointer(T.GLint64), 'params']]));};
T.PFNGLINVALIDATETEXSUBIMAGEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth']]));};
T.PFNGLINVALIDATETEXIMAGEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLINVALIDATEBUFFERSUBDATAPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'length']]));};
T.PFNGLINVALIDATEBUFFERDATAPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer']]));};
T.PFNGLINVALIDATEFRAMEBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'numAttachments'], [Pointer(T.GLenum), 'attachments']]));};
T.PFNGLINVALIDATESUBFRAMEBUFFERPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'numAttachments'], [Pointer(T.GLenum), 'attachments'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLMULTIDRAWARRAYSINDIRECTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(null), 'indirect'], [T.GLsizei, 'drawcount'], [T.GLsizei, 'stride']]));};
T.PFNGLMULTIDRAWELEMENTSINDIRECTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLenum, 'type'], [Pointer(null), 'indirect'], [T.GLsizei, 'drawcount'], [T.GLsizei, 'stride']]));};
T.PFNGLGETPROGRAMINTERFACEIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMRESOURCEINDEXPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETPROGRAMRESOURCENAMEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETPROGRAMRESOURCEIVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [T.GLuint, 'index'], [T.GLsizei, 'propCount'], [Pointer(T.GLenum), 'props'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMRESOURCELOCATIONPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETPROGRAMRESOURCELOCATIONINDEXPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [T.GLenum, 'programInterface'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLSHADERSTORAGEBLOCKBINDINGPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'storageBlockIndex'], [T.GLuint, 'storageBlockBinding']]));};
T.PFNGLTEXBUFFERRANGEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLTEXTUREBUFFERRANGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLTEXSTORAGE2DMULTISAMPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLTEXSTORAGE3DMULTISAMPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLTEXTURESTORAGE2DMULTISAMPLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLTEXTURESTORAGE3DMULTISAMPLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedsamplelocations']]));};
T.PFNGLBLENDCOLOREXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue'], [T.GLfloat, 'alpha']]));};
T.PFNGLPOLYGONOFFSETEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'factor'], [T.GLfloat, 'bias']]));};
T.PFNGLTEXIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXSUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLGETTEXFILTERFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'filter'], [Pointer(T.GLfloat), 'weights']]));};
T.PFNGLTEXFILTERFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'filter'], [T.GLsizei, 'n'], [Pointer(T.GLfloat), 'weights']]));};
T.PFNGLTEXSUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXSUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYTEXIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLint, 'border']]));};
T.PFNGLCOPYTEXIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border']]));};
T.PFNGLCOPYTEXSUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLCOPYTEXSUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLCOPYTEXSUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETHISTOGRAMEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'values']]));};
T.PFNGLGETHISTOGRAMPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETHISTOGRAMPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMINMAXEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'values']]));};
T.PFNGLGETMINMAXPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMINMAXPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLHISTOGRAMEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'width'], [T.GLenum, 'internalformat'], [T.GLboolean, 'sink']]));};
T.PFNGLMINMAXEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLboolean, 'sink']]));};
T.PFNGLRESETHISTOGRAMEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLRESETMINMAXEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLCONVOLUTIONFILTER1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']]));};
T.PFNGLCONVOLUTIONFILTER2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']]));};
T.PFNGLCONVOLUTIONPARAMETERFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'params']]));};
T.PFNGLCONVOLUTIONPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLCONVOLUTIONPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'params']]));};
T.PFNGLCONVOLUTIONPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLCOPYCONVOLUTIONFILTER1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLCOPYCONVOLUTIONFILTER2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETCONVOLUTIONFILTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']]));};
T.PFNGLGETCONVOLUTIONPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETCONVOLUTIONPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETSEPARABLEFILTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'row'], [Pointer(T.GLvoid), 'column'], [Pointer(T.GLvoid), 'span']]));};
T.PFNGLSEPARABLEFILTER2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'row'], [Pointer(T.GLvoid), 'column']]));};
T.PFNGLCOLORTABLESGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'table']]));};
T.PFNGLCOLORTABLEPARAMETERFVSGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLCOLORTABLEPARAMETERIVSGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLCOPYCOLORTABLESGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLGETCOLORTABLESGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'table']]));};
T.PFNGLGETCOLORTABLEPARAMETERFVSGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETCOLORTABLEPARAMETERIVSGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPIXELTEXGENSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLPIXELTEXGENPARAMETERISGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLPIXELTEXGENPARAMETERIVSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPIXELTEXGENPARAMETERFSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPIXELTEXGENPARAMETERFVSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPIXELTEXGENPARAMETERIVSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPIXELTEXGENPARAMETERFVSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLTEXIMAGE4DSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLsizei, 'size4d'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXSUBIMAGE4DSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'woffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLsizei, 'size4d'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLARETEXTURESRESIDENTEXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures'], [Pointer(T.GLboolean), 'residences']]));};
T.PFNGLBINDTEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'texture']]));};
T.PFNGLDELETETEXTURESEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures']]));};
T.PFNGLGENTEXTURESEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures']]));};
T.PFNGLISTEXTUREEXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'texture']]));};
T.PFNGLPRIORITIZETEXTURESEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures'], [Pointer(T.GLclampf), 'priorities']]));};
T.PFNGLDETAILTEXFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'n'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLGETDETAILTEXFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLSHARPENTEXFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'n'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLGETSHARPENTEXFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLSAMPLEMASKSGISPROC = function() {return Pointer(Fn(null, [[T.GLclampf, 'value'], [T.GLboolean, 'invert']]));};
T.PFNGLSAMPLEPATTERNSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pattern']]));};
T.PFNGLARRAYELEMENTEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'i']]));};
T.PFNGLCOLORPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLDRAWARRAYSEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count']]));};
T.PFNGLEDGEFLAGPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLboolean), 'pointer']]));};
T.PFNGLGETPOINTERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']]));};
T.PFNGLINDEXPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLNORMALPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLTEXCOORDPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLVERTEXPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLsizei, 'count'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLBLENDEQUATIONEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLSPRITEPARAMETERFSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLSPRITEPARAMETERFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLSPRITEPARAMETERISGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLSPRITEPARAMETERIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPOINTPARAMETERFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPOINTPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLPOINTPARAMETERFSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPOINTPARAMETERFVSGISPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETINSTRUMENTSSGIXPROC = function() {return Pointer(Fn(T.GLint, [[null]]));};
T.PFNGLINSTRUMENTSBUFFERSGIXPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'size'], [Pointer(T.GLint), 'buffer']]));};
T.PFNGLPOLLINSTRUMENTSSGIXPROC = function() {return Pointer(Fn(T.GLint, [[Pointer(T.GLint), 'marker_p']]));};
T.PFNGLREADINSTRUMENTSSGIXPROC = function() {return Pointer(Fn(null, [[T.GLint, 'marker']]));};
T.PFNGLSTARTINSTRUMENTSSGIXPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLSTOPINSTRUMENTSSGIXPROC = function() {return Pointer(Fn(null, [[T.GLint, 'marker']]));};
T.PFNGLFRAMEZOOMSGIXPROC = function() {return Pointer(Fn(null, [[T.GLint, 'factor']]));};
T.PFNGLTAGSAMPLEBUFFERSGIXPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLDEFORMATIONMAP3DSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [T.GLdouble, 'w1'], [T.GLdouble, 'w2'], [T.GLint, 'wstride'], [T.GLint, 'worder'], [Pointer(T.GLdouble), 'points']]));};
T.PFNGLDEFORMATIONMAP3FSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [T.GLfloat, 'w1'], [T.GLfloat, 'w2'], [T.GLint, 'wstride'], [T.GLint, 'worder'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLDEFORMSGIXPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'mask']]));};
T.PFNGLLOADIDENTITYDEFORMATIONMAPSGIXPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'mask']]));};
T.PFNGLREFERENCEPLANESGIXPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'equation']]));};
T.PFNGLFLUSHRASTERSGIXPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLFOGFUNCSGISPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLGETFOGFUNCSGISPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'points']]));};
T.PFNGLIMAGETRANSFORMPARAMETERIHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLIMAGETRANSFORMPARAMETERFHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLIMAGETRANSFORMPARAMETERIVHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLIMAGETRANSFORMPARAMETERFVHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETIMAGETRANSFORMPARAMETERIVHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETIMAGETRANSFORMPARAMETERFVHPPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLCOLORSUBTABLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'start'], [T.GLsizei, 'count'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLCOPYCOLORSUBTABLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'start'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLHINTPGIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'mode']]));};
T.PFNGLCOLORTABLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalFormat'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'table']]));};
T.PFNGLGETCOLORTABLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGETCOLORTABLEPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETCOLORTABLEPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETLISTPARAMETERFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETLISTPARAMETERIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLLISTPARAMETERFSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLLISTPARAMETERFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLLISTPARAMETERISGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLLISTPARAMETERIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLINDEXMATERIALEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'mode']]));};
T.PFNGLINDEXFUNCEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'func'], [T.GLclampf, 'ref']]));};
T.PFNGLLOCKARRAYSEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'first'], [T.GLsizei, 'count']]));};
T.PFNGLUNLOCKARRAYSEXTPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLCULLPARAMETERDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLCULLPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLFRAGMENTCOLORMATERIALSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'mode']]));};
T.PFNGLFRAGMENTLIGHTFSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLFRAGMENTLIGHTFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLFRAGMENTLIGHTISGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLFRAGMENTLIGHTIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLFRAGMENTLIGHTMODELFSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLFRAGMENTLIGHTMODELFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLFRAGMENTLIGHTMODELISGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLFRAGMENTLIGHTMODELIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLFRAGMENTMATERIALFSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLFRAGMENTMATERIALFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLFRAGMENTMATERIALISGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLFRAGMENTMATERIALIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETFRAGMENTLIGHTFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETFRAGMENTLIGHTIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETFRAGMENTMATERIALFVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETFRAGMENTMATERIALIVSGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLLIGHTENVISGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLDRAWRANGEELEMENTSEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices']]));};
T.PFNGLAPPLYTEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLTEXTURELIGHTEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname']]));};
T.PFNGLTEXTUREMATERIALEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'mode']]));};
T.PFNGLASYNCMARKERSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'marker']]));};
T.PFNGLFINISHASYNCSGIXPROC = function() {return Pointer(Fn(T.GLint, [[Pointer(T.GLuint), 'markerp']]));};
T.PFNGLPOLLASYNCSGIXPROC = function() {return Pointer(Fn(T.GLint, [[Pointer(T.GLuint), 'markerp']]));};
T.PFNGLGENASYNCMARKERSSGIXPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLsizei, 'range']]));};
T.PFNGLDELETEASYNCMARKERSSGIXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'marker'], [T.GLsizei, 'range']]));};
T.PFNGLISASYNCMARKERSGIXPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'marker']]));};
T.PFNGLVERTEXPOINTERVINTELPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLNORMALPOINTERVINTELPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLCOLORPOINTERVINTELPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLTEXCOORDPOINTERVINTELPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLPIXELTRANSFORMPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLPIXELTRANSFORMPARAMETERFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLPIXELTRANSFORMPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPIXELTRANSFORMPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPIXELTRANSFORMPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPIXELTRANSFORMPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLSECONDARYCOLOR3BEXTPROC = function() {return Pointer(Fn(null, [[T.GLbyte, 'red'], [T.GLbyte, 'green'], [T.GLbyte, 'blue']]));};
T.PFNGLSECONDARYCOLOR3BVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLbyte), 'v']]));};
T.PFNGLSECONDARYCOLOR3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'red'], [T.GLdouble, 'green'], [T.GLdouble, 'blue']]));};
T.PFNGLSECONDARYCOLOR3DVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLSECONDARYCOLOR3FEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue']]));};
T.PFNGLSECONDARYCOLOR3FVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLSECONDARYCOLOR3IEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'red'], [T.GLint, 'green'], [T.GLint, 'blue']]));};
T.PFNGLSECONDARYCOLOR3IVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLSECONDARYCOLOR3SEXTPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'red'], [T.GLshort, 'green'], [T.GLshort, 'blue']]));};
T.PFNGLSECONDARYCOLOR3SVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLSECONDARYCOLOR3UBEXTPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'red'], [T.GLubyte, 'green'], [T.GLubyte, 'blue']]));};
T.PFNGLSECONDARYCOLOR3UBVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLubyte), 'v']]));};
T.PFNGLSECONDARYCOLOR3UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'red'], [T.GLuint, 'green'], [T.GLuint, 'blue']]));};
T.PFNGLSECONDARYCOLOR3UIVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'v']]));};
T.PFNGLSECONDARYCOLOR3USEXTPROC = function() {return Pointer(Fn(null, [[T.GLushort, 'red'], [T.GLushort, 'green'], [T.GLushort, 'blue']]));};
T.PFNGLSECONDARYCOLOR3USVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLushort), 'v']]));};
T.PFNGLSECONDARYCOLORPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLTEXTURENORMALEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLMULTIDRAWARRAYSEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLint), 'first'], [Pointer(T.GLsizei), 'count'], [T.GLsizei, 'primcount']]));};
T.PFNGLMULTIDRAWELEMENTSEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLsizei), 'count'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'indices'], [T.GLsizei, 'primcount']]));};
T.PFNGLFOGCOORDFEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'coord']]));};
T.PFNGLFOGCOORDFVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'coord']]));};
T.PFNGLFOGCOORDDEXTPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'coord']]));};
T.PFNGLFOGCOORDDVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'coord']]));};
T.PFNGLFOGCOORDPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLTANGENT3BEXTPROC = function() {return Pointer(Fn(null, [[T.GLbyte, 'tx'], [T.GLbyte, 'ty'], [T.GLbyte, 'tz']]));};
T.PFNGLTANGENT3BVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLbyte), 'v']]));};
T.PFNGLTANGENT3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'tx'], [T.GLdouble, 'ty'], [T.GLdouble, 'tz']]));};
T.PFNGLTANGENT3DVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLTANGENT3FEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'tx'], [T.GLfloat, 'ty'], [T.GLfloat, 'tz']]));};
T.PFNGLTANGENT3FVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLTANGENT3IEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'tx'], [T.GLint, 'ty'], [T.GLint, 'tz']]));};
T.PFNGLTANGENT3IVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLTANGENT3SEXTPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'tx'], [T.GLshort, 'ty'], [T.GLshort, 'tz']]));};
T.PFNGLTANGENT3SVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLBINORMAL3BEXTPROC = function() {return Pointer(Fn(null, [[T.GLbyte, 'bx'], [T.GLbyte, 'by'], [T.GLbyte, 'bz']]));};
T.PFNGLBINORMAL3BVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLbyte), 'v']]));};
T.PFNGLBINORMAL3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'bx'], [T.GLdouble, 'by'], [T.GLdouble, 'bz']]));};
T.PFNGLBINORMAL3DVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLBINORMAL3FEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'bx'], [T.GLfloat, 'by'], [T.GLfloat, 'bz']]));};
T.PFNGLBINORMAL3FVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLBINORMAL3IEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'bx'], [T.GLint, 'by'], [T.GLint, 'bz']]));};
T.PFNGLBINORMAL3IVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLBINORMAL3SEXTPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'bx'], [T.GLshort, 'by'], [T.GLshort, 'bz']]));};
T.PFNGLBINORMAL3SVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLTANGENTPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLBINORMALPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLFINISHTEXTURESUNXPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLGLOBALALPHAFACTORBSUNPROC = function() {return Pointer(Fn(null, [[T.GLbyte, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORSSUNPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORISUNPROC = function() {return Pointer(Fn(null, [[T.GLint, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORFSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORDSUNPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORUBSUNPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORUSSUNPROC = function() {return Pointer(Fn(null, [[T.GLushort, 'factor']]));};
T.PFNGLGLOBALALPHAFACTORUISUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'factor']]));};
T.PFNGLREPLACEMENTCODEUISUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'code']]));};
T.PFNGLREPLACEMENTCODEUSSUNPROC = function() {return Pointer(Fn(null, [[T.GLushort, 'code']]));};
T.PFNGLREPLACEMENTCODEUBSUNPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'code']]));};
T.PFNGLREPLACEMENTCODEUIVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'code']]));};
T.PFNGLREPLACEMENTCODEUSVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLushort), 'code']]));};
T.PFNGLREPLACEMENTCODEUBVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLubyte), 'code']]));};
T.PFNGLREPLACEMENTCODEPOINTERSUNPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLCOLOR4UBVERTEX2FSUNPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'r'], [T.GLubyte, 'g'], [T.GLubyte, 'b'], [T.GLubyte, 'a'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLCOLOR4UBVERTEX2FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLubyte), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLCOLOR4UBVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLubyte, 'r'], [T.GLubyte, 'g'], [T.GLubyte, 'b'], [T.GLubyte, 'a'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLCOLOR4UBVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLubyte), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLCOLOR3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLCOLOR3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLCOLOR4FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'a'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLCOLOR4FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD2FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLTEXCOORD2FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD4FVERTEX4FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'p'], [T.GLfloat, 'q'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLTEXCOORD4FVERTEX4FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD2FCOLOR4UBVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLubyte, 'r'], [T.GLubyte, 'g'], [T.GLubyte, 'b'], [T.GLubyte, 'a'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLTEXCOORD2FCOLOR4UBVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLubyte), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD2FCOLOR3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLTEXCOORD2FCOLOR3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD2FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLTEXCOORD2FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD2FCOLOR4FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'a'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLTEXCOORD2FCOLOR4FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLTEXCOORD4FCOLOR4FNORMAL3FVERTEX4FSUNPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'p'], [T.GLfloat, 'q'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'a'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLTEXCOORD4FCOLOR4FNORMAL3FVERTEX4FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUIVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUIVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUICOLOR4UBVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLubyte, 'r'], [T.GLubyte, 'g'], [T.GLubyte, 'b'], [T.GLubyte, 'a'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUICOLOR4UBVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLubyte), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUICOLOR3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUICOLOR3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUINORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUINORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUICOLOR4FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'a'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUICOLOR4FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FCOLOR4FNORMAL3FVERTEX3FSUNPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'rc'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'g'], [T.GLfloat, 'b'], [T.GLfloat, 'a'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLREPLACEMENTCODEUITEXCOORD2FCOLOR4FNORMAL3FVERTEX3FVSUNPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLuint), 'rc'], [Pointer(T.GLfloat), 'tc'], [Pointer(T.GLfloat), 'c'], [Pointer(T.GLfloat), 'n'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLBLENDFUNCSEPARATEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'sfactorRGB'], [T.GLenum, 'dfactorRGB'], [T.GLenum, 'sfactorAlpha'], [T.GLenum, 'dfactorAlpha']]));};
T.PFNGLBLENDFUNCSEPARATEINGRPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'sfactorRGB'], [T.GLenum, 'dfactorRGB'], [T.GLenum, 'sfactorAlpha'], [T.GLenum, 'dfactorAlpha']]));};
T.PFNGLVERTEXWEIGHTFEXTPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'weight']]));};
T.PFNGLVERTEXWEIGHTFVEXTPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'weight']]));};
T.PFNGLVERTEXWEIGHTPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLFLUSHVERTEXARRAYRANGENVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLVERTEXARRAYRANGENVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLCOMBINERPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLCOMBINERPARAMETERFNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLCOMBINERPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLCOMBINERPARAMETERINVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLCOMBINERINPUTNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'variable'], [T.GLenum, 'input'], [T.GLenum, 'mapping'], [T.GLenum, 'componentUsage']]));};
T.PFNGLCOMBINEROUTPUTNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'abOutput'], [T.GLenum, 'cdOutput'], [T.GLenum, 'sumOutput'], [T.GLenum, 'scale'], [T.GLenum, 'bias'], [T.GLboolean, 'abDotProduct'], [T.GLboolean, 'cdDotProduct'], [T.GLboolean, 'muxSum']]));};
T.PFNGLFINALCOMBINERINPUTNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'variable'], [T.GLenum, 'input'], [T.GLenum, 'mapping'], [T.GLenum, 'componentUsage']]));};
T.PFNGLGETCOMBINERINPUTPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'variable'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETCOMBINERINPUTPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'variable'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETCOMBINEROUTPUTPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETCOMBINEROUTPUTPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'portion'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETFINALCOMBINERINPUTPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'variable'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETFINALCOMBINERINPUTPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'variable'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLRESIZEBUFFERSMESAPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLWINDOWPOS2DMESAPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLWINDOWPOS2DVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS2FMESAPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLWINDOWPOS2FVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS2IMESAPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLWINDOWPOS2IVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS2SMESAPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLWINDOWPOS2SVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLWINDOWPOS3DMESAPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLWINDOWPOS3DVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS3FMESAPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLWINDOWPOS3FVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS3IMESAPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLWINDOWPOS3IVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS3SMESAPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLWINDOWPOS3SVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLWINDOWPOS4DMESAPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLWINDOWPOS4DVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLdouble), 'v']]));};
T.PFNGLWINDOWPOS4FMESAPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLWINDOWPOS4FVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLfloat), 'v']]));};
T.PFNGLWINDOWPOS4IMESAPROC = function() {return Pointer(Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLWINDOWPOS4IVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'v']]));};
T.PFNGLWINDOWPOS4SMESAPROC = function() {return Pointer(Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']]));};
T.PFNGLWINDOWPOS4SVMESAPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLshort), 'v']]));};
T.PFNGLMULTIMODEDRAWARRAYSIBMPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLenum), 'mode'], [Pointer(T.GLint), 'first'], [Pointer(T.GLsizei), 'count'], [T.GLsizei, 'primcount'], [T.GLint, 'modestride']]));};
T.PFNGLMULTIMODEDRAWELEMENTSIBMPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLenum), 'mode'], [Pointer(T.GLsizei), 'count'], [T.GLenum, 'type'], [Pointer(Pointer(T.GLvoid)), 'indices'], [T.GLsizei, 'primcount'], [T.GLint, 'modestride']]));};
T.PFNGLCOLORPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLSECONDARYCOLORPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLEDGEFLAGPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLint, 'stride'], [Pointer(Pointer(T.GLboolean)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLFOGCOORDPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLINDEXPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLNORMALPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLTEXCOORDPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLVERTEXPOINTERLISTIBMPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLint, 'stride'], [Pointer(Pointer(T.GLvoid)), 'pointer'], [T.GLint, 'ptrstride']]));};
T.PFNGLTBUFFERMASK3DFXPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'mask']]));};
T.PFNGLSAMPLEMASKEXTPROC = function() {return Pointer(Fn(null, [[T.GLclampf, 'value'], [T.GLboolean, 'invert']]));};
T.PFNGLSAMPLEPATTERNEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pattern']]));};
T.PFNGLTEXTURECOLORMASKSGISPROC = function() {return Pointer(Fn(null, [[T.GLboolean, 'red'], [T.GLboolean, 'green'], [T.GLboolean, 'blue'], [T.GLboolean, 'alpha']]));};
T.PFNGLIGLOOINTERFACESGIXPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLvoid), 'params']]));};
T.PFNGLDELETEFENCESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'fences']]));};
T.PFNGLGENFENCESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'fences']]));};
T.PFNGLISFENCENVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'fence']]));};
T.PFNGLTESTFENCENVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'fence']]));};
T.PFNGLGETFENCEIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'fence'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLFINISHFENCENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'fence']]));};
T.PFNGLSETFENCENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'fence'], [T.GLenum, 'condition']]));};
T.PFNGLMAPCONTROLPOINTSNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLsizei, 'ustride'], [T.GLsizei, 'vstride'], [T.GLint, 'uorder'], [T.GLint, 'vorder'], [T.GLboolean, 'packed'], [Pointer(T.GLvoid), 'points']]));};
T.PFNGLMAPPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLMAPPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMAPCONTROLPOINTSNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'type'], [T.GLsizei, 'ustride'], [T.GLsizei, 'vstride'], [T.GLboolean, 'packed'], [Pointer(T.GLvoid), 'points']]));};
T.PFNGLGETMAPPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMAPPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMAPATTRIBPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMAPATTRIBPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLEVALMAPSNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'mode']]));};
T.PFNGLCOMBINERSTAGEPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETCOMBINERSTAGEPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stage'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLAREPROGRAMSRESIDENTNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs'], [Pointer(T.GLboolean), 'residences']]));};
T.PFNGLBINDPROGRAMNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id']]));};
T.PFNGLDELETEPROGRAMSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs']]));};
T.PFNGLEXECUTEPROGRAMNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGENPROGRAMSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs']]));};
T.PFNGLGETPROGRAMPARAMETERDVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETPROGRAMPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPROGRAMIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMSTRINGNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLubyte), 'program']]));};
T.PFNGLGETTRACKMATRIXIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'address'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBDVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETVERTEXATTRIBFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVERTEXATTRIBIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBPOINTERVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'pointer']]));};
T.PFNGLISPROGRAMNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLLOADPROGRAMNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'program']]));};
T.PFNGLPROGRAMPARAMETER4DNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLPROGRAMPARAMETER4DVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLPROGRAMPARAMETER4FNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLPROGRAMPARAMETER4FVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLPROGRAMPARAMETERS4DVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLPROGRAMPARAMETERS4FVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLREQUESTRESIDENTPROGRAMSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'programs']]));};
T.PFNGLTRACKMATRIXNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'address'], [T.GLenum, 'matrix'], [T.GLenum, 'transform']]));};
T.PFNGLVERTEXATTRIBPOINTERNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'fsize'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLVERTEXATTRIB1DNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXATTRIB1DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB1FNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x']]));};
T.PFNGLVERTEXATTRIB1FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB1SNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x']]));};
T.PFNGLVERTEXATTRIB1SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB2DNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXATTRIB2DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB2FNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLVERTEXATTRIB2FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB2SNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLVERTEXATTRIB2SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB3DNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXATTRIB3DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB3FNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLVERTEXATTRIB3FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB3SNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLVERTEXATTRIB3SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4DNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXATTRIB4DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIB4FNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLVERTEXATTRIB4FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIB4SNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']]));};
T.PFNGLVERTEXATTRIB4SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIB4UBNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLubyte, 'x'], [T.GLubyte, 'y'], [T.GLubyte, 'z'], [T.GLubyte, 'w']]));};
T.PFNGLVERTEXATTRIB4UBVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIBS1DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBS1FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIBS1SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBS2DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBS2FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIBS2SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBS3DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBS3FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIBS3SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBS4DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBS4FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLVERTEXATTRIBS4SVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBS4UBVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLTEXBUMPPARAMETERIVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'param']]));};
T.PFNGLTEXBUMPPARAMETERFVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'param']]));};
T.PFNGLGETTEXBUMPPARAMETERIVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'param']]));};
T.PFNGLGETTEXBUMPPARAMETERFVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'param']]));};
T.PFNGLGENFRAGMENTSHADERSATIPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'range']]));};
T.PFNGLBINDFRAGMENTSHADERATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLDELETEFRAGMENTSHADERATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLBEGINFRAGMENTSHADERATIPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLENDFRAGMENTSHADERATIPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLPASSTEXCOORDATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'dst'], [T.GLuint, 'coord'], [T.GLenum, 'swizzle']]));};
T.PFNGLSAMPLEMAPATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'dst'], [T.GLuint, 'interp'], [T.GLenum, 'swizzle']]));};
T.PFNGLCOLORFRAGMENTOP1ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMask'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod']]));};
T.PFNGLCOLORFRAGMENTOP2ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMask'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod'], [T.GLuint, 'arg2'], [T.GLuint, 'arg2Rep'], [T.GLuint, 'arg2Mod']]));};
T.PFNGLCOLORFRAGMENTOP3ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMask'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod'], [T.GLuint, 'arg2'], [T.GLuint, 'arg2Rep'], [T.GLuint, 'arg2Mod'], [T.GLuint, 'arg3'], [T.GLuint, 'arg3Rep'], [T.GLuint, 'arg3Mod']]));};
T.PFNGLALPHAFRAGMENTOP1ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod']]));};
T.PFNGLALPHAFRAGMENTOP2ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod'], [T.GLuint, 'arg2'], [T.GLuint, 'arg2Rep'], [T.GLuint, 'arg2Mod']]));};
T.PFNGLALPHAFRAGMENTOP3ATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'dst'], [T.GLuint, 'dstMod'], [T.GLuint, 'arg1'], [T.GLuint, 'arg1Rep'], [T.GLuint, 'arg1Mod'], [T.GLuint, 'arg2'], [T.GLuint, 'arg2Rep'], [T.GLuint, 'arg2Mod'], [T.GLuint, 'arg3'], [T.GLuint, 'arg3Rep'], [T.GLuint, 'arg3Mod']]));};
T.PFNGLSETFRAGMENTSHADERCONSTANTATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'dst'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPNTRIANGLESIATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLPNTRIANGLESFATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLNEWOBJECTBUFFERATIPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLsizei, 'size'], [Pointer(T.GLvoid), 'pointer'], [T.GLenum, 'usage']]));};
T.PFNGLISOBJECTBUFFERATIPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'buffer']]));};
T.PFNGLUPDATEOBJECTBUFFERATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLuint, 'offset'], [T.GLsizei, 'size'], [Pointer(T.GLvoid), 'pointer'], [T.GLenum, 'preserve']]));};
T.PFNGLGETOBJECTBUFFERFVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETOBJECTBUFFERIVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLFREEOBJECTBUFFERATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer']]));};
T.PFNGLARRAYOBJECTATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'array'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLuint, 'buffer'], [T.GLuint, 'offset']]));};
T.PFNGLGETARRAYOBJECTFVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'array'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETARRAYOBJECTIVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'array'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLVARIANTARRAYOBJECTATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLuint, 'buffer'], [T.GLuint, 'offset']]));};
T.PFNGLGETVARIANTARRAYOBJECTFVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVARIANTARRAYOBJECTIVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLBEGINVERTEXSHADEREXTPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLENDVERTEXSHADEREXTPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLBINDVERTEXSHADEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLGENVERTEXSHADERSEXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'range']]));};
T.PFNGLDELETEVERTEXSHADEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLSHADEROP1EXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'res'], [T.GLuint, 'arg1']]));};
T.PFNGLSHADEROP2EXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'res'], [T.GLuint, 'arg1'], [T.GLuint, 'arg2']]));};
T.PFNGLSHADEROP3EXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'op'], [T.GLuint, 'res'], [T.GLuint, 'arg1'], [T.GLuint, 'arg2'], [T.GLuint, 'arg3']]));};
T.PFNGLSWIZZLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'res'], [T.GLuint, 'in'], [T.GLenum, 'outX'], [T.GLenum, 'outY'], [T.GLenum, 'outZ'], [T.GLenum, 'outW']]));};
T.PFNGLWRITEMASKEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'res'], [T.GLuint, 'in'], [T.GLenum, 'outX'], [T.GLenum, 'outY'], [T.GLenum, 'outZ'], [T.GLenum, 'outW']]));};
T.PFNGLINSERTCOMPONENTEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'res'], [T.GLuint, 'src'], [T.GLuint, 'num']]));};
T.PFNGLEXTRACTCOMPONENTEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'res'], [T.GLuint, 'src'], [T.GLuint, 'num']]));};
T.PFNGLGENSYMBOLSEXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'datatype'], [T.GLenum, 'storagetype'], [T.GLenum, 'range'], [T.GLuint, 'components']]));};
T.PFNGLSETINVARIANTEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'addr']]));};
T.PFNGLSETLOCALCONSTANTEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'addr']]));};
T.PFNGLVARIANTBVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLbyte), 'addr']]));};
T.PFNGLVARIANTSVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLshort), 'addr']]));};
T.PFNGLVARIANTIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLint), 'addr']]));};
T.PFNGLVARIANTFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLfloat), 'addr']]));};
T.PFNGLVARIANTDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLdouble), 'addr']]));};
T.PFNGLVARIANTUBVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLubyte), 'addr']]));};
T.PFNGLVARIANTUSVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLushort), 'addr']]));};
T.PFNGLVARIANTUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [Pointer(T.GLuint), 'addr']]));};
T.PFNGLVARIANTPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'type'], [T.GLuint, 'stride'], [Pointer(T.GLvoid), 'addr']]));};
T.PFNGLENABLEVARIANTCLIENTSTATEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLDISABLEVARIANTCLIENTSTATEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLBINDLIGHTPARAMETEREXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'light'], [T.GLenum, 'value']]));};
T.PFNGLBINDMATERIALPARAMETEREXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'face'], [T.GLenum, 'value']]));};
T.PFNGLBINDTEXGENPARAMETEREXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'unit'], [T.GLenum, 'coord'], [T.GLenum, 'value']]));};
T.PFNGLBINDTEXTUREUNITPARAMETEREXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'unit'], [T.GLenum, 'value']]));};
T.PFNGLBINDPARAMETEREXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'value']]));};
T.PFNGLISVARIANTENABLEDEXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id'], [T.GLenum, 'cap']]));};
T.PFNGLGETVARIANTBOOLEANVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLboolean), 'data']]));};
T.PFNGLGETVARIANTINTEGERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLint), 'data']]));};
T.PFNGLGETVARIANTFLOATVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLfloat), 'data']]));};
T.PFNGLGETVARIANTPOINTERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(Pointer(T.GLvoid)), 'data']]));};
T.PFNGLGETINVARIANTBOOLEANVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLboolean), 'data']]));};
T.PFNGLGETINVARIANTINTEGERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLint), 'data']]));};
T.PFNGLGETINVARIANTFLOATVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLfloat), 'data']]));};
T.PFNGLGETLOCALCONSTANTBOOLEANVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLboolean), 'data']]));};
T.PFNGLGETLOCALCONSTANTINTEGERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLint), 'data']]));};
T.PFNGLGETLOCALCONSTANTFLOATVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'value'], [Pointer(T.GLfloat), 'data']]));};
T.PFNGLVERTEXSTREAM1SATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLshort, 'x']]));};
T.PFNGLVERTEXSTREAM1SVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLshort), 'coords']]));};
T.PFNGLVERTEXSTREAM1IATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLint, 'x']]));};
T.PFNGLVERTEXSTREAM1IVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLint), 'coords']]));};
T.PFNGLVERTEXSTREAM1FATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLfloat, 'x']]));};
T.PFNGLVERTEXSTREAM1FVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLVERTEXSTREAM1DATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXSTREAM1DVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLdouble), 'coords']]));};
T.PFNGLVERTEXSTREAM2SATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLshort, 'x'], [T.GLshort, 'y']]));};
T.PFNGLVERTEXSTREAM2SVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLshort), 'coords']]));};
T.PFNGLVERTEXSTREAM2IATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLVERTEXSTREAM2IVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLint), 'coords']]));};
T.PFNGLVERTEXSTREAM2FATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLVERTEXSTREAM2FVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLVERTEXSTREAM2DATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXSTREAM2DVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLdouble), 'coords']]));};
T.PFNGLVERTEXSTREAM3SATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']]));};
T.PFNGLVERTEXSTREAM3SVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLshort), 'coords']]));};
T.PFNGLVERTEXSTREAM3IATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLVERTEXSTREAM3IVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLint), 'coords']]));};
T.PFNGLVERTEXSTREAM3FATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLVERTEXSTREAM3FVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLVERTEXSTREAM3DATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXSTREAM3DVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLdouble), 'coords']]));};
T.PFNGLVERTEXSTREAM4SATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']]));};
T.PFNGLVERTEXSTREAM4SVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLshort), 'coords']]));};
T.PFNGLVERTEXSTREAM4IATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLVERTEXSTREAM4IVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLint), 'coords']]));};
T.PFNGLVERTEXSTREAM4FATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLVERTEXSTREAM4FVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLVERTEXSTREAM4DATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXSTREAM4DVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLdouble), 'coords']]));};
T.PFNGLNORMALSTREAM3BATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLbyte, 'nx'], [T.GLbyte, 'ny'], [T.GLbyte, 'nz']]));};
T.PFNGLNORMALSTREAM3BVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLbyte), 'coords']]));};
T.PFNGLNORMALSTREAM3SATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLshort, 'nx'], [T.GLshort, 'ny'], [T.GLshort, 'nz']]));};
T.PFNGLNORMALSTREAM3SVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLshort), 'coords']]));};
T.PFNGLNORMALSTREAM3IATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLint, 'nx'], [T.GLint, 'ny'], [T.GLint, 'nz']]));};
T.PFNGLNORMALSTREAM3IVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLint), 'coords']]));};
T.PFNGLNORMALSTREAM3FATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz']]));};
T.PFNGLNORMALSTREAM3FVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLNORMALSTREAM3DATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [T.GLdouble, 'nx'], [T.GLdouble, 'ny'], [T.GLdouble, 'nz']]));};
T.PFNGLNORMALSTREAM3DVATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream'], [Pointer(T.GLdouble), 'coords']]));};
T.PFNGLCLIENTACTIVEVERTEXSTREAMATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'stream']]));};
T.PFNGLVERTEXBLENDENVIATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLVERTEXBLENDENVFATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLELEMENTPOINTERATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLDRAWELEMENTARRAYATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count']]));};
T.PFNGLDRAWRANGEELEMENTARRAYATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLsizei, 'count']]));};
T.PFNGLDRAWMESHARRAYSSUNPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count'], [T.GLsizei, 'width']]));};
T.PFNGLGENOCCLUSIONQUERIESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLDELETEOCCLUSIONQUERIESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLISOCCLUSIONQUERYNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLBEGINOCCLUSIONQUERYNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id']]));};
T.PFNGLENDOCCLUSIONQUERYNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLGETOCCLUSIONQUERYIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETOCCLUSIONQUERYUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPOINTPARAMETERINVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLPOINTPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLACTIVESTENCILFACEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face']]));};
T.PFNGLELEMENTPOINTERAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLDRAWELEMENTARRAYAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count']]));};
T.PFNGLDRAWRANGEELEMENTARRAYAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLint, 'first'], [T.GLsizei, 'count']]));};
T.PFNGLMULTIDRAWELEMENTARRAYAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLint), 'first'], [Pointer(T.GLsizei), 'count'], [T.GLsizei, 'primcount']]));};
T.PFNGLMULTIDRAWRANGEELEMENTARRAYAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [Pointer(T.GLint), 'first'], [Pointer(T.GLsizei), 'count'], [T.GLsizei, 'primcount']]));};
T.PFNGLGENFENCESAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'fences']]));};
T.PFNGLDELETEFENCESAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'fences']]));};
T.PFNGLSETFENCEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'fence']]));};
T.PFNGLISFENCEAPPLEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'fence']]));};
T.PFNGLTESTFENCEAPPLEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'fence']]));};
T.PFNGLFINISHFENCEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'fence']]));};
T.PFNGLTESTOBJECTAPPLEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'object'], [T.GLuint, 'name']]));};
T.PFNGLFINISHOBJECTAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'object'], [T.GLint, 'name']]));};
T.PFNGLBINDVERTEXARRAYAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'array']]));};
T.PFNGLDELETEVERTEXARRAYSAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'arrays']]));};
T.PFNGLGENVERTEXARRAYSAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'arrays']]));};
T.PFNGLISVERTEXARRAYAPPLEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'array']]));};
T.PFNGLVERTEXARRAYRANGEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLFLUSHVERTEXARRAYRANGEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLVERTEXARRAYPARAMETERIAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLDRAWBUFFERSATIPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLenum), 'bufs']]));};
T.PFNGLPROGRAMNAMEDPARAMETER4FNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLPROGRAMNAMEDPARAMETER4DNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLPROGRAMNAMEDPARAMETER4FVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [Pointer(T.GLfloat), 'v']]));};
T.PFNGLPROGRAMNAMEDPARAMETER4DVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLGETPROGRAMNAMEDPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETPROGRAMNAMEDPARAMETERDVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLVERTEX2HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'x'], [T.GLhalfNV, 'y']]));};
T.PFNGLVERTEX2HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEX3HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'x'], [T.GLhalfNV, 'y'], [T.GLhalfNV, 'z']]));};
T.PFNGLVERTEX3HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEX4HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'x'], [T.GLhalfNV, 'y'], [T.GLhalfNV, 'z'], [T.GLhalfNV, 'w']]));};
T.PFNGLVERTEX4HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLNORMAL3HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'nx'], [T.GLhalfNV, 'ny'], [T.GLhalfNV, 'nz']]));};
T.PFNGLNORMAL3HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLCOLOR3HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'red'], [T.GLhalfNV, 'green'], [T.GLhalfNV, 'blue']]));};
T.PFNGLCOLOR3HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLCOLOR4HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'red'], [T.GLhalfNV, 'green'], [T.GLhalfNV, 'blue'], [T.GLhalfNV, 'alpha']]));};
T.PFNGLCOLOR4HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLTEXCOORD1HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 's']]));};
T.PFNGLTEXCOORD1HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLTEXCOORD2HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 's'], [T.GLhalfNV, 't']]));};
T.PFNGLTEXCOORD2HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLTEXCOORD3HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 's'], [T.GLhalfNV, 't'], [T.GLhalfNV, 'r']]));};
T.PFNGLTEXCOORD3HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLTEXCOORD4HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 's'], [T.GLhalfNV, 't'], [T.GLhalfNV, 'r'], [T.GLhalfNV, 'q']]));};
T.PFNGLTEXCOORD4HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLMULTITEXCOORD1HNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLhalfNV, 's']]));};
T.PFNGLMULTITEXCOORD1HVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLMULTITEXCOORD2HNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLhalfNV, 's'], [T.GLhalfNV, 't']]));};
T.PFNGLMULTITEXCOORD2HVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLMULTITEXCOORD3HNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLhalfNV, 's'], [T.GLhalfNV, 't'], [T.GLhalfNV, 'r']]));};
T.PFNGLMULTITEXCOORD3HVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLMULTITEXCOORD4HNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLhalfNV, 's'], [T.GLhalfNV, 't'], [T.GLhalfNV, 'r'], [T.GLhalfNV, 'q']]));};
T.PFNGLMULTITEXCOORD4HVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLFOGCOORDHNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'fog']]));};
T.PFNGLFOGCOORDHVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'fog']]));};
T.PFNGLSECONDARYCOLOR3HNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'red'], [T.GLhalfNV, 'green'], [T.GLhalfNV, 'blue']]));};
T.PFNGLSECONDARYCOLOR3HVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXWEIGHTHNVPROC = function() {return Pointer(Fn(null, [[T.GLhalfNV, 'weight']]));};
T.PFNGLVERTEXWEIGHTHVNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLhalfNV), 'weight']]));};
T.PFNGLVERTEXATTRIB1HNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLhalfNV, 'x']]));};
T.PFNGLVERTEXATTRIB1HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIB2HNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLhalfNV, 'x'], [T.GLhalfNV, 'y']]));};
T.PFNGLVERTEXATTRIB2HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIB3HNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLhalfNV, 'x'], [T.GLhalfNV, 'y'], [T.GLhalfNV, 'z']]));};
T.PFNGLVERTEXATTRIB3HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIB4HNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLhalfNV, 'x'], [T.GLhalfNV, 'y'], [T.GLhalfNV, 'z'], [T.GLhalfNV, 'w']]));};
T.PFNGLVERTEXATTRIB4HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIBS1HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'n'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIBS2HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'n'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIBS3HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'n'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLVERTEXATTRIBS4HVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLsizei, 'n'], [Pointer(T.GLhalfNV), 'v']]));};
T.PFNGLPIXELDATARANGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLFLUSHPIXELDATARANGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLPRIMITIVERESTARTNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLPRIMITIVERESTARTINDEXNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index']]));};
T.PFNGLMAPOBJECTBUFFERATIPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLuint, 'buffer']]));};
T.PFNGLUNMAPOBJECTBUFFERATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer']]));};
T.PFNGLSTENCILOPSEPARATEATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'sfail'], [T.GLenum, 'dpfail'], [T.GLenum, 'dppass']]));};
T.PFNGLSTENCILFUNCSEPARATEATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'frontfunc'], [T.GLenum, 'backfunc'], [T.GLint, 'ref'], [T.GLuint, 'mask']]));};
T.PFNGLVERTEXATTRIBARRAYOBJECTATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLsizei, 'stride'], [T.GLuint, 'buffer'], [T.GLuint, 'offset']]));};
T.PFNGLGETVERTEXATTRIBARRAYOBJECTFVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVERTEXATTRIBARRAYOBJECTIVATIPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLDEPTHBOUNDSEXTPROC = function() {return Pointer(Fn(null, [[T.GLclampd, 'zmin'], [T.GLclampd, 'zmax']]));};
T.PFNGLBLENDEQUATIONSEPARATEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'modeRGB'], [T.GLenum, 'modeAlpha']]));};
T.PFNGLISRENDERBUFFEREXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'renderbuffer']]));};
T.PFNGLBINDRENDERBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLDELETERENDERBUFFERSEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'renderbuffers']]));};
T.PFNGLGENRENDERBUFFERSEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'renderbuffers']]));};
T.PFNGLRENDERBUFFERSTORAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETRENDERBUFFERPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLISFRAMEBUFFEREXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'framebuffer']]));};
T.PFNGLBINDFRAMEBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'framebuffer']]));};
T.PFNGLDELETEFRAMEBUFFERSEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'framebuffers']]));};
T.PFNGLGENFRAMEBUFFERSEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'framebuffers']]));};
T.PFNGLCHECKFRAMEBUFFERSTATUSEXTPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLenum, 'target']]));};
T.PFNGLFRAMEBUFFERTEXTURE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'zoffset']]));};
T.PFNGLFRAMEBUFFERRENDERBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'renderbuffertarget'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLGETFRAMEBUFFERATTACHMENTPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGENERATEMIPMAPEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLSTRINGMARKERGREMEDYPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'len'], [Pointer(T.GLvoid), 'string']]));};
T.PFNGLSTENCILCLEARTAGEXTPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'stencilTagBits'], [T.GLuint, 'stencilClearTag']]));};
T.PFNGLBLITFRAMEBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'srcX0'], [T.GLint, 'srcY0'], [T.GLint, 'srcX1'], [T.GLint, 'srcY1'], [T.GLint, 'dstX0'], [T.GLint, 'dstY0'], [T.GLint, 'dstX1'], [T.GLint, 'dstY1'], [T.GLbitfield, 'mask'], [T.GLenum, 'filter']]));};
T.PFNGLRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETQUERYOBJECTI64VEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLint64EXT), 'params']]));};
T.PFNGLGETQUERYOBJECTUI64VEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'pname'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLPROGRAMENVPARAMETERS4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETERS4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLBUFFERPARAMETERIAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLFLUSHMAPPEDBUFFERRANGEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLPROGRAMLOCALPARAMETERI4INVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLPROGRAMLOCALPARAMETERI4IVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETERSI4IVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETERI4UINVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z'], [T.GLuint, 'w']]));};
T.PFNGLPROGRAMLOCALPARAMETERI4UIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPROGRAMLOCALPARAMETERSI4UIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPROGRAMENVPARAMETERI4INVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLPROGRAMENVPARAMETERI4IVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMENVPARAMETERSI4IVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMENVPARAMETERI4UINVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z'], [T.GLuint, 'w']]));};
T.PFNGLPROGRAMENVPARAMETERI4UIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPROGRAMENVPARAMETERSI4UIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETPROGRAMLOCALPARAMETERIIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMLOCALPARAMETERIUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETPROGRAMENVPARAMETERIIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETPROGRAMENVPARAMETERIUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPROGRAMVERTEXLIMITNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLint, 'limit']]));};
T.PFNGLFRAMEBUFFERTEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLFRAMEBUFFERTEXTURELAYEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'layer']]));};
T.PFNGLFRAMEBUFFERTEXTUREFACEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLenum, 'face']]));};
T.PFNGLPROGRAMPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'pname'], [T.GLint, 'value']]));};
T.PFNGLVERTEXATTRIBI1IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x']]));};
T.PFNGLVERTEXATTRIBI2IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y']]));};
T.PFNGLVERTEXATTRIBI3IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']]));};
T.PFNGLVERTEXATTRIBI4IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLVERTEXATTRIBI1UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x']]));};
T.PFNGLVERTEXATTRIBI2UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y']]));};
T.PFNGLVERTEXATTRIBI3UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z']]));};
T.PFNGLVERTEXATTRIBI4UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z'], [T.GLuint, 'w']]));};
T.PFNGLVERTEXATTRIBI1IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI2IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI3IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI4IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint), 'v']]));};
T.PFNGLVERTEXATTRIBI1UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI2UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI3UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI4UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint), 'v']]));};
T.PFNGLVERTEXATTRIBI4BVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLbyte), 'v']]));};
T.PFNGLVERTEXATTRIBI4SVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLshort), 'v']]));};
T.PFNGLVERTEXATTRIBI4UBVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLubyte), 'v']]));};
T.PFNGLVERTEXATTRIBI4USVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLushort), 'v']]));};
T.PFNGLVERTEXATTRIBIPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLGETVERTEXATTRIBIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVERTEXATTRIBIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETUNIFORMUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLBINDFRAGDATALOCATIONEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'color'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETFRAGDATALOCATIONEXTPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLUNIFORM1UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0']]));};
T.PFNGLUNIFORM2UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1']]));};
T.PFNGLUNIFORM3UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2']]));};
T.PFNGLUNIFORM4UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2'], [T.GLuint, 'v3']]));};
T.PFNGLUNIFORM1UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM2UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM3UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLUNIFORM4UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLDRAWARRAYSINSTANCEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'start'], [T.GLsizei, 'count'], [T.GLsizei, 'primcount']]));};
T.PFNGLDRAWELEMENTSINSTANCEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices'], [T.GLsizei, 'primcount']]));};
T.PFNGLTEXBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer']]));};
T.PFNGLDEPTHRANGEDNVPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'zNear'], [T.GLdouble, 'zFar']]));};
T.PFNGLCLEARDEPTHDNVPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'depth']]));};
T.PFNGLDEPTHBOUNDSDNVPROC = function() {return Pointer(Fn(null, [[T.GLdouble, 'zmin'], [T.GLdouble, 'zmax']]));};
T.PFNGLRENDERBUFFERSTORAGEMULTISAMPLECOVERAGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLPROGRAMBUFFERPARAMETERSFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'buffer'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLPROGRAMBUFFERPARAMETERSIIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'buffer'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'params']]));};
T.PFNGLPROGRAMBUFFERPARAMETERSIUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'buffer'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLCOLORMASKINDEXEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLboolean, 'r'], [T.GLboolean, 'g'], [T.GLboolean, 'b'], [T.GLboolean, 'a']]));};
T.PFNGLGETBOOLEANINDEXEDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLboolean), 'data']]));};
T.PFNGLGETINTEGERINDEXEDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'data']]));};
T.PFNGLENABLEINDEXEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLDISABLEINDEXEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLISENABLEDINDEXEDEXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'target'], [T.GLuint, 'index']]));};
T.PFNGLBEGINTRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'primitiveMode']]));};
T.PFNGLENDTRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLTRANSFORMFEEDBACKATTRIBSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'count'], [Pointer(T.GLint), 'attribs'], [T.GLenum, 'bufferMode']]));};
T.PFNGLBINDBUFFERRANGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLBINDBUFFEROFFSETNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset']]));};
T.PFNGLBINDBUFFERBASENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer']]));};
T.PFNGLTRANSFORMFEEDBACKVARYINGSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'locations'], [T.GLenum, 'bufferMode']]));};
T.PFNGLACTIVEVARYINGNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETVARYINGLOCATIONNVPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETACTIVEVARYINGNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLsizei), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLGETTRANSFORMFEEDBACKVARYINGNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [Pointer(T.GLint), 'location']]));};
T.PFNGLTRANSFORMFEEDBACKSTREAMATTRIBSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'count'], [Pointer(T.GLint), 'attribs'], [T.GLsizei, 'nbuffers'], [Pointer(T.GLint), 'bufstreams'], [T.GLenum, 'bufferMode']]));};
T.PFNGLUNIFORMBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'buffer']]));};
T.PFNGLGETUNIFORMBUFFERSIZEEXTPROC = function() {return Pointer(Fn(T.GLint, [[T.GLuint, 'program'], [T.GLint, 'location']]));};
T.PFNGLGETUNIFORMOFFSETEXTPROC = function() {return Pointer(Fn(T.GLintptr, [[T.GLuint, 'program'], [T.GLint, 'location']]));};
T.PFNGLTEXPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLTEXPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETTEXPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETTEXPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLCLEARCOLORIIEXTPROC = function() {return Pointer(Fn(null, [[T.GLint, 'red'], [T.GLint, 'green'], [T.GLint, 'blue'], [T.GLint, 'alpha']]));};
T.PFNGLCLEARCOLORIUIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'red'], [T.GLuint, 'green'], [T.GLuint, 'blue'], [T.GLuint, 'alpha']]));};
T.PFNGLFRAMETERMINATORGREMEDYPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLBEGINCONDITIONALRENDERNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'id'], [T.GLenum, 'mode']]));};
T.PFNGLENDCONDITIONALRENDERNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLPRESENTFRAMEKEYEDNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLuint64EXT, 'minPresentTime'], [T.GLuint, 'beginPresentTimeId'], [T.GLuint, 'presentDurationId'], [T.GLenum, 'type'], [T.GLenum, 'target0'], [T.GLuint, 'fill0'], [T.GLuint, 'key0'], [T.GLenum, 'target1'], [T.GLuint, 'fill1'], [T.GLuint, 'key1']]));};
T.PFNGLPRESENTFRAMEDUALFILLNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLuint64EXT, 'minPresentTime'], [T.GLuint, 'beginPresentTimeId'], [T.GLuint, 'presentDurationId'], [T.GLenum, 'type'], [T.GLenum, 'target0'], [T.GLuint, 'fill0'], [T.GLenum, 'target1'], [T.GLuint, 'fill1'], [T.GLenum, 'target2'], [T.GLuint, 'fill2'], [T.GLenum, 'target3'], [T.GLuint, 'fill3']]));};
T.PFNGLGETVIDEOIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVIDEOUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETVIDEOI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLenum, 'pname'], [Pointer(T.GLint64EXT), 'params']]));};
T.PFNGLGETVIDEOUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_slot'], [T.GLenum, 'pname'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLBEGINTRANSFORMFEEDBACKEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'primitiveMode']]));};
T.PFNGLENDTRANSFORMFEEDBACKEXTPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLBINDBUFFERRANGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLBINDBUFFEROFFSETEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer'], [T.GLintptr, 'offset']]));};
T.PFNGLBINDBUFFERBASEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'buffer']]));};
T.PFNGLTRANSFORMFEEDBACKVARYINGSEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLsizei, 'count'], [Pointer(Pointer(T.GLchar)), 'varyings'], [T.GLenum, 'bufferMode']]));};
T.PFNGLGETTRANSFORMFEEDBACKVARYINGEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLuint, 'index'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLsizei), 'size'], [Pointer(T.GLenum), 'type'], [Pointer(T.GLchar), 'name']]));};
T.PFNGLCLIENTATTRIBDEFAULTEXTPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'mask']]));};
T.PFNGLPUSHCLIENTATTRIBDEFAULTEXTPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'mask']]));};
T.PFNGLMATRIXLOADFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLfloat), 'm']]));};
T.PFNGLMATRIXLOADDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLdouble), 'm']]));};
T.PFNGLMATRIXMULTFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLfloat), 'm']]));};
T.PFNGLMATRIXMULTDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLdouble), 'm']]));};
T.PFNGLMATRIXLOADIDENTITYEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLMATRIXROTATEFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLfloat, 'angle'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLMATRIXROTATEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLdouble, 'angle'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLMATRIXSCALEFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLMATRIXSCALEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLMATRIXTRANSLATEFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']]));};
T.PFNGLMATRIXTRANSLATEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLMATRIXFRUSTUMEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLdouble, 'left'], [T.GLdouble, 'right'], [T.GLdouble, 'bottom'], [T.GLdouble, 'top'], [T.GLdouble, 'zNear'], [T.GLdouble, 'zFar']]));};
T.PFNGLMATRIXORTHOEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLdouble, 'left'], [T.GLdouble, 'right'], [T.GLdouble, 'bottom'], [T.GLdouble, 'top'], [T.GLdouble, 'zNear'], [T.GLdouble, 'zFar']]));};
T.PFNGLMATRIXPOPEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLMATRIXPUSHEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLMATRIXLOADTRANSPOSEFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLfloat), 'm']]));};
T.PFNGLMATRIXLOADTRANSPOSEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLdouble), 'm']]));};
T.PFNGLMATRIXMULTTRANSPOSEFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLfloat), 'm']]));};
T.PFNGLMATRIXMULTTRANSPOSEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLdouble), 'm']]));};
T.PFNGLTEXTUREPARAMETERFEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLTEXTUREPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLTEXTUREPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLTEXTUREPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLTEXTUREIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXTUREIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXTURESUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXTURESUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYTEXTUREIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLint, 'border']]));};
T.PFNGLCOPYTEXTUREIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border']]));};
T.PFNGLCOPYTEXTURESUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLCOPYTEXTURESUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETTEXTUREIMAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLGETTEXTUREPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETTEXTUREPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETTEXTURELEVELPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETTEXTURELEVELPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLTEXTUREIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLTEXTURESUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYTEXTURESUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLMULTITEXPARAMETERFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLMULTITEXPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLMULTITEXPARAMETERIEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLMULTITEXPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLMULTITEXIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLMULTITEXIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLMULTITEXSUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLMULTITEXSUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYMULTITEXIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLint, 'border']]));};
T.PFNGLCOPYMULTITEXIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border']]));};
T.PFNGLCOPYMULTITEXSUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']]));};
T.PFNGLCOPYMULTITEXSUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETMULTITEXIMAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLGETMULTITEXPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMULTITEXPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMULTITEXLEVELPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMULTITEXLEVELPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLMULTITEXIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLMULTITEXSUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']]));};
T.PFNGLCOPYMULTITEXSUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLBINDMULTITEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLuint, 'texture']]));};
T.PFNGLENABLECLIENTSTATEINDEXEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'array'], [T.GLuint, 'index']]));};
T.PFNGLDISABLECLIENTSTATEINDEXEDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'array'], [T.GLuint, 'index']]));};
T.PFNGLMULTITEXCOORDPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLMULTITEXENVFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLMULTITEXENVFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLMULTITEXENVIEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLMULTITEXENVIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLMULTITEXGENDEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLdouble, 'param']]));};
T.PFNGLMULTITEXGENDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLMULTITEXGENFEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLfloat, 'param']]));};
T.PFNGLMULTITEXGENFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLMULTITEXGENIEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLint, 'param']]));};
T.PFNGLMULTITEXGENIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMULTITEXENVFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMULTITEXENVIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMULTITEXGENDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETMULTITEXGENFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETMULTITEXGENIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETFLOATINDEXEDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'data']]));};
T.PFNGLGETDOUBLEINDEXEDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'data']]));};
T.PFNGLGETPOINTERINDEXEDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(Pointer(T.GLvoid)), 'data']]));};
T.PFNGLCOMPRESSEDTEXTUREIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDTEXTUREIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDTEXTUREIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDTEXTURESUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDTEXTURESUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDTEXTURESUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLGETCOMPRESSEDTEXTUREIMAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLint, 'lod'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLCOMPRESSEDMULTITEXIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDMULTITEXIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDMULTITEXIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDMULTITEXSUBIMAGE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDMULTITEXSUBIMAGE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLCOMPRESSEDMULTITEXSUBIMAGE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'bits']]));};
T.PFNGLGETCOMPRESSEDMULTITEXIMAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLint, 'lod'], [Pointer(T.GLvoid), 'img']]));};
T.PFNGLNAMEDPROGRAMSTRINGEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLsizei, 'len'], [Pointer(T.GLvoid), 'string']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETER4DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETER4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETER4FEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETER4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETNAMEDPROGRAMLOCALPARAMETERDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLGETNAMEDPROGRAMLOCALPARAMETERFVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETNAMEDPROGRAMIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETNAMEDPROGRAMSTRINGEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLvoid), 'string']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERS4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERI4IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERI4IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERSI4IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'params']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERI4UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLuint, 'x'], [T.GLuint, 'y'], [T.GLuint, 'z'], [T.GLuint, 'w']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERI4UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLNAMEDPROGRAMLOCALPARAMETERSI4UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETNAMEDPROGRAMLOCALPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETNAMEDPROGRAMLOCALPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLTEXTUREPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLTEXTUREPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETTEXTUREPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETTEXTUREPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLMULTITEXPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLMULTITEXPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETMULTITEXPARAMETERIIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETMULTITEXPARAMETERIUIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLPROGRAMUNIFORM1FEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0']]));};
T.PFNGLPROGRAMUNIFORM2FEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1']]));};
T.PFNGLPROGRAMUNIFORM3FEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2']]));};
T.PFNGLPROGRAMUNIFORM4FEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLfloat, 'v0'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLfloat, 'v3']]));};
T.PFNGLPROGRAMUNIFORM1IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0']]));};
T.PFNGLPROGRAMUNIFORM2IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1']]));};
T.PFNGLPROGRAMUNIFORM3IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2']]));};
T.PFNGLPROGRAMUNIFORM4IEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint, 'v0'], [T.GLint, 'v1'], [T.GLint, 'v2'], [T.GLint, 'v3']]));};
T.PFNGLPROGRAMUNIFORM1FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM2FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM3FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM1IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM2IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM3IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORM4IVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X3FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X2FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X2FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X4FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X3FVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPROGRAMUNIFORM1UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0']]));};
T.PFNGLPROGRAMUNIFORM2UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1']]));};
T.PFNGLPROGRAMUNIFORM3UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2']]));};
T.PFNGLPROGRAMUNIFORM4UIEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint, 'v0'], [T.GLuint, 'v1'], [T.GLuint, 'v2'], [T.GLuint, 'v3']]));};
T.PFNGLPROGRAMUNIFORM1UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM2UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM3UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLPROGRAMUNIFORM4UIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'value']]));};
T.PFNGLNAMEDBUFFERDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data'], [T.GLenum, 'usage']]));};
T.PFNGLNAMEDBUFFERSUBDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLMAPNAMEDBUFFEREXTPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLuint, 'buffer'], [T.GLenum, 'access']]));};
T.PFNGLUNMAPNAMEDBUFFEREXTPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'buffer']]));};
T.PFNGLMAPNAMEDBUFFERRANGEEXTPROC = function() {return Pointer(Fn(Pointer(T.GLvoid), [[T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'length'], [T.GLbitfield, 'access']]));};
T.PFNGLFLUSHMAPPEDNAMEDBUFFERRANGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'length']]));};
T.PFNGLNAMEDCOPYBUFFERSUBDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'readBuffer'], [T.GLuint, 'writeBuffer'], [T.GLintptr, 'readOffset'], [T.GLintptr, 'writeOffset'], [T.GLsizeiptr, 'size']]));};
T.PFNGLGETNAMEDBUFFERPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETNAMEDBUFFERPOINTERVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']]));};
T.PFNGLGETNAMEDBUFFERSUBDATAEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLintptr, 'offset'], [T.GLsizeiptr, 'size'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLTEXTUREBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer']]));};
T.PFNGLMULTITEXBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLuint, 'buffer']]));};
T.PFNGLNAMEDRENDERBUFFERSTORAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'renderbuffer'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLGETNAMEDRENDERBUFFERPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'renderbuffer'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLCHECKNAMEDFRAMEBUFFERSTATUSEXTPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLuint, 'framebuffer'], [T.GLenum, 'target']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTURE1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTURE2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTURE3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLenum, 'textarget'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'zoffset']]));};
T.PFNGLNAMEDFRAMEBUFFERRENDERBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLenum, 'renderbuffertarget'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLGETNAMEDFRAMEBUFFERATTACHMENTPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGENERATETEXTUREMIPMAPEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target']]));};
T.PFNGLGENERATEMULTITEXMIPMAPEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target']]));};
T.PFNGLFRAMEBUFFERDRAWBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'mode']]));};
T.PFNGLFRAMEBUFFERDRAWBUFFERSEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLsizei, 'n'], [Pointer(T.GLenum), 'bufs']]));};
T.PFNGLFRAMEBUFFERREADBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'mode']]));};
T.PFNGLGETFRAMEBUFFERPARAMETERIVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLNAMEDRENDERBUFFERSTORAGEMULTISAMPLEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'renderbuffer'], [T.GLsizei, 'samples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLNAMEDRENDERBUFFERSTORAGEMULTISAMPLECOVERAGEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'renderbuffer'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTURELAYEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLint, 'layer']]));};
T.PFNGLNAMEDFRAMEBUFFERTEXTUREFACEEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'framebuffer'], [T.GLenum, 'attachment'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLenum, 'face']]));};
T.PFNGLTEXTURERENDERBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLMULTITEXRENDERBUFFEREXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texunit'], [T.GLenum, 'target'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLPROGRAMUNIFORM1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'x']]));};
T.PFNGLPROGRAMUNIFORM2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLPROGRAMUNIFORM3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLPROGRAMUNIFORM4DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLPROGRAMUNIFORM1DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM2DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM3DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORM4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X3DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX2X4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X2DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX3X4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X2DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLPROGRAMUNIFORMMATRIX4X3DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [T.GLboolean, 'transpose'], [Pointer(T.GLdouble), 'value']]));};
T.PFNGLGETMULTISAMPLEFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'val']]));};
T.PFNGLSAMPLEMASKINDEXEDNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLbitfield, 'mask']]));};
T.PFNGLTEXRENDERBUFFERNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'renderbuffer']]));};
T.PFNGLBINDTRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'id']]));};
T.PFNGLDELETETRANSFORMFEEDBACKSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLGENTRANSFORMFEEDBACKSNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'ids']]));};
T.PFNGLISTRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'id']]));};
T.PFNGLPAUSETRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLRESUMETRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLDRAWTRANSFORMFEEDBACKNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'id']]));};
T.PFNGLGETPERFMONITORGROUPSAMDPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLint), 'numGroups'], [T.GLsizei, 'groupsSize'], [Pointer(T.GLuint), 'groups']]));};
T.PFNGLGETPERFMONITORCOUNTERSAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'group'], [Pointer(T.GLint), 'numCounters'], [Pointer(T.GLint), 'maxActiveCounters'], [T.GLsizei, 'counterSize'], [Pointer(T.GLuint), 'counters']]));};
T.PFNGLGETPERFMONITORGROUPSTRINGAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'group'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'groupString']]));};
T.PFNGLGETPERFMONITORCOUNTERSTRINGAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'group'], [T.GLuint, 'counter'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLchar), 'counterString']]));};
T.PFNGLGETPERFMONITORCOUNTERINFOAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'group'], [T.GLuint, 'counter'], [T.GLenum, 'pname'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLGENPERFMONITORSAMDPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'monitors']]));};
T.PFNGLDELETEPERFMONITORSAMDPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'monitors']]));};
T.PFNGLSELECTPERFMONITORCOUNTERSAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'monitor'], [T.GLboolean, 'enable'], [T.GLuint, 'group'], [T.GLint, 'numCounters'], [Pointer(T.GLuint), 'counterList']]));};
T.PFNGLBEGINPERFMONITORAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'monitor']]));};
T.PFNGLENDPERFMONITORAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'monitor']]));};
T.PFNGLGETPERFMONITORCOUNTERDATAAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'monitor'], [T.GLenum, 'pname'], [T.GLsizei, 'dataSize'], [Pointer(T.GLuint), 'data'], [Pointer(T.GLint), 'bytesWritten']]));};
T.PFNGLTESSELLATIONFACTORAMDPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'factor']]));};
T.PFNGLTESSELLATIONMODEAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLPROVOKINGVERTEXEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode']]));};
T.PFNGLBLENDFUNCINDEXEDAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'src'], [T.GLenum, 'dst']]));};
T.PFNGLBLENDFUNCSEPARATEINDEXEDAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'srcRGB'], [T.GLenum, 'dstRGB'], [T.GLenum, 'srcAlpha'], [T.GLenum, 'dstAlpha']]));};
T.PFNGLBLENDEQUATIONINDEXEDAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'mode']]));};
T.PFNGLBLENDEQUATIONSEPARATEINDEXEDAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buf'], [T.GLenum, 'modeRGB'], [T.GLenum, 'modeAlpha']]));};
T.PFNGLTEXTURERANGEAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLGETTEXPARAMETERPOINTERVAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']]));};
T.PFNGLENABLEVERTEXATTRIBAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname']]));};
T.PFNGLDISABLEVERTEXATTRIBAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname']]));};
T.PFNGLISVERTEXATTRIBENABLEDAPPLEPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'index'], [T.GLenum, 'pname']]));};
T.PFNGLMAPVERTEXATTRIB1DAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'size'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'stride'], [T.GLint, 'order'], [Pointer(T.GLdouble), 'points']]));};
T.PFNGLMAPVERTEXATTRIB1FAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'size'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'stride'], [T.GLint, 'order'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLMAPVERTEXATTRIB2DAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'size'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [Pointer(T.GLdouble), 'points']]));};
T.PFNGLMAPVERTEXATTRIB2FAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'size'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [Pointer(T.GLfloat), 'points']]));};
T.PFNGLOBJECTPURGEABLEAPPLEPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLenum, 'objectType'], [T.GLuint, 'name'], [T.GLenum, 'option']]));};
T.PFNGLOBJECTUNPURGEABLEAPPLEPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLenum, 'objectType'], [T.GLuint, 'name'], [T.GLenum, 'option']]));};
T.PFNGLGETOBJECTPARAMETERIVAPPLEPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'objectType'], [T.GLuint, 'name'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLBEGINVIDEOCAPTURENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot']]));};
T.PFNGLBINDVIDEOCAPTURESTREAMBUFFERNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'frame_region'], [T.GLintptrARB, 'offset']]));};
T.PFNGLBINDVIDEOCAPTURESTREAMTEXTURENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'frame_region'], [T.GLenum, 'target'], [T.GLuint, 'texture']]));};
T.PFNGLENDVIDEOCAPTURENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot']]));};
T.PFNGLGETVIDEOCAPTUREIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVIDEOCAPTURESTREAMIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLGETVIDEOCAPTURESTREAMFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLGETVIDEOCAPTURESTREAMDVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLVIDEOCAPTURENVPROC = function() {return Pointer(Fn(T.GLenum, [[T.GLuint, 'video_capture_slot'], [Pointer(T.GLuint), 'sequence_num'], [Pointer(T.GLuint64EXT), 'capture_time']]));};
T.PFNGLVIDEOCAPTURESTREAMPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']]));};
T.PFNGLVIDEOCAPTURESTREAMPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']]));};
T.PFNGLVIDEOCAPTURESTREAMPARAMETERDVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'video_capture_slot'], [T.GLuint, 'stream'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLCOPYIMAGESUBDATANVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'srcName'], [T.GLenum, 'srcTarget'], [T.GLint, 'srcLevel'], [T.GLint, 'srcX'], [T.GLint, 'srcY'], [T.GLint, 'srcZ'], [T.GLuint, 'dstName'], [T.GLenum, 'dstTarget'], [T.GLint, 'dstLevel'], [T.GLint, 'dstX'], [T.GLint, 'dstY'], [T.GLint, 'dstZ'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth']]));};
T.PFNGLUSESHADERPROGRAMEXTPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLuint, 'program']]));};
T.PFNGLACTIVEPROGRAMEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program']]));};
T.PFNGLCREATESHADERPROGRAMEXTPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLenum, 'type'], [Pointer(T.GLchar), 'string']]));};
T.PFNGLMAKEBUFFERRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'access']]));};
T.PFNGLMAKEBUFFERNONRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target']]));};
T.PFNGLISBUFFERRESIDENTNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'target']]));};
T.PFNGLMAKENAMEDBUFFERRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'access']]));};
T.PFNGLMAKENAMEDBUFFERNONRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer']]));};
T.PFNGLISNAMEDBUFFERRESIDENTNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'buffer']]));};
T.PFNGLGETBUFFERPARAMETERUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLGETNAMEDBUFFERPARAMETERUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'buffer'], [T.GLenum, 'pname'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLGETINTEGERUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'value'], [Pointer(T.GLuint64EXT), 'result']]));};
T.PFNGLUNIFORMUI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64EXT, 'value']]));};
T.PFNGLUNIFORMUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLGETUNIFORMUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLPROGRAMUNIFORMUI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64EXT, 'value']]));};
T.PFNGLPROGRAMUNIFORMUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLBUFFERADDRESSRANGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLuint, 'index'], [T.GLuint64EXT, 'address'], [T.GLsizeiptr, 'length']]));};
T.PFNGLVERTEXFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLNORMALFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLCOLORFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLINDEXFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLTEXCOORDFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLEDGEFLAGFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'stride']]));};
T.PFNGLSECONDARYCOLORFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLFOGCOORDFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLVERTEXATTRIBFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLboolean, 'normalized'], [T.GLsizei, 'stride']]));};
T.PFNGLVERTEXATTRIBIFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLGETINTEGERUI64I_VNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'value'], [T.GLuint, 'index'], [Pointer(T.GLuint64EXT), 'result']]));};
T.PFNGLTEXTUREBARRIERNVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLBINDIMAGETEXTUREEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLboolean, 'layered'], [T.GLint, 'layer'], [T.GLenum, 'access'], [T.GLint, 'format']]));};
T.PFNGLMEMORYBARRIEREXTPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'barriers']]));};
T.PFNGLVERTEXATTRIBL1DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x']]));};
T.PFNGLVERTEXATTRIBL2DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y']]));};
T.PFNGLVERTEXATTRIBL3DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']]));};
T.PFNGLVERTEXATTRIBL4DEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']]));};
T.PFNGLVERTEXATTRIBL1DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL2DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL3DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBL4DVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLdouble), 'v']]));};
T.PFNGLVERTEXATTRIBLPOINTEREXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']]));};
T.PFNGLGETVERTEXATTRIBLDVEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']]));};
T.PFNGLVERTEXARRAYVERTEXATTRIBLOFFSETEXTPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'vaobj'], [T.GLuint, 'buffer'], [T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [T.GLintptr, 'offset']]));};
T.PFNGLPROGRAMSUBROUTINEPARAMETERSUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'params']]));};
T.PFNGLGETPROGRAMSUBROUTINEPARAMETERUIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'index'], [Pointer(T.GLuint), 'param']]));};
T.PFNGLUNIFORM1I64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint64EXT, 'x']]));};
T.PFNGLUNIFORM2I64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y']]));};
T.PFNGLUNIFORM3I64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z']]));};
T.PFNGLUNIFORM4I64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z'], [T.GLint64EXT, 'w']]));};
T.PFNGLUNIFORM1I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLUNIFORM2I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLUNIFORM3I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLUNIFORM4I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLUNIFORM1UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64EXT, 'x']]));};
T.PFNGLUNIFORM2UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y']]));};
T.PFNGLUNIFORM3UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z']]));};
T.PFNGLUNIFORM4UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z'], [T.GLuint64EXT, 'w']]));};
T.PFNGLUNIFORM1UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLUNIFORM2UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLUNIFORM3UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLUNIFORM4UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLGETUNIFORMI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [Pointer(T.GLint64EXT), 'params']]));};
T.PFNGLPROGRAMUNIFORM1I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint64EXT, 'x']]));};
T.PFNGLPROGRAMUNIFORM2I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y']]));};
T.PFNGLPROGRAMUNIFORM3I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z']]));};
T.PFNGLPROGRAMUNIFORM4I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z'], [T.GLint64EXT, 'w']]));};
T.PFNGLPROGRAMUNIFORM1I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM2I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM3I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM4I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM1UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64EXT, 'x']]));};
T.PFNGLPROGRAMUNIFORM2UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y']]));};
T.PFNGLPROGRAMUNIFORM3UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z']]));};
T.PFNGLPROGRAMUNIFORM4UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z'], [T.GLuint64EXT, 'w']]));};
T.PFNGLPROGRAMUNIFORM1UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM2UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM3UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLPROGRAMUNIFORM4UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64EXT), 'value']]));};
T.PFNGLVERTEXATTRIBL1I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint64EXT, 'x']]));};
T.PFNGLVERTEXATTRIBL2I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y']]));};
T.PFNGLVERTEXATTRIBL3I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z']]));};
T.PFNGLVERTEXATTRIBL4I64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint64EXT, 'x'], [T.GLint64EXT, 'y'], [T.GLint64EXT, 'z'], [T.GLint64EXT, 'w']]));};
T.PFNGLVERTEXATTRIBL1I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL2I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL3I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL4I64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL1UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint64EXT, 'x']]));};
T.PFNGLVERTEXATTRIBL2UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y']]));};
T.PFNGLVERTEXATTRIBL3UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z']]));};
T.PFNGLVERTEXATTRIBL4UI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLuint64EXT, 'x'], [T.GLuint64EXT, 'y'], [T.GLuint64EXT, 'z'], [T.GLuint64EXT, 'w']]));};
T.PFNGLVERTEXATTRIBL1UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL2UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL3UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint64EXT), 'v']]));};
T.PFNGLVERTEXATTRIBL4UI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [Pointer(T.GLuint64EXT), 'v']]));};
T.PFNGLGETVERTEXATTRIBLI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLint64EXT), 'params']]));};
T.PFNGLGETVERTEXATTRIBLUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLenum, 'pname'], [Pointer(T.GLuint64EXT), 'params']]));};
T.PFNGLVERTEXATTRIBLFORMATNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'index'], [T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride']]));};
T.PFNGLGENNAMESAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'identifier'], [T.GLuint, 'num'], [Pointer(T.GLuint), 'names']]));};
T.PFNGLDELETENAMESAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'identifier'], [T.GLuint, 'num'], [Pointer(T.GLuint), 'names']]));};
T.PFNGLISNAMEAMDPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLenum, 'identifier'], [T.GLuint, 'name']]));};
T.PFNGLDEBUGMESSAGEENABLEAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'category'], [T.GLenum, 'severity'], [T.GLsizei, 'count'], [Pointer(T.GLuint), 'ids'], [T.GLboolean, 'enabled']]));};
T.PFNGLDEBUGMESSAGEINSERTAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'category'], [T.GLenum, 'severity'], [T.GLuint, 'id'], [T.GLsizei, 'length'], [Pointer(T.GLchar), 'buf']]));};
T.PFNGLDEBUGMESSAGECALLBACKAMDPROC = function() {return Pointer(Fn(null, [[T.GLDEBUGPROCAMD, 'callback'], [Pointer(T.GLvoid), 'userParam']]));};
T.PFNGLGETDEBUGMESSAGELOGAMDPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLuint, 'count'], [T.GLsizei, 'bufsize'], [Pointer(T.GLenum), 'categories'], [Pointer(T.GLuint), 'severities'], [Pointer(T.GLuint), 'ids'], [Pointer(T.GLsizei), 'lengths'], [Pointer(T.GLchar), 'message']]));};
T.PFNGLVDPAUINITNVPROC = function() {return Pointer(Fn(null, [[Pointer(T.GLvoid), 'vdpDevice'], [Pointer(T.GLvoid), 'getProcAddress']]));};
T.PFNGLVDPAUFININVPROC = function() {return Pointer(Fn(null, [[null]]));};
T.PFNGLVDPAUREGISTERVIDEOSURFACENVPROC = function() {return Pointer(Fn(T.GLvdpauSurfaceNV, [[Pointer(T.GLvoid), 'vdpSurface'], [T.GLenum, 'target'], [T.GLsizei, 'numTextureNames'], [Pointer(T.GLuint), 'textureNames']]));};
T.PFNGLVDPAUREGISTEROUTPUTSURFACENVPROC = function() {return Pointer(Fn(T.GLvdpauSurfaceNV, [[Pointer(T.GLvoid), 'vdpSurface'], [T.GLenum, 'target'], [T.GLsizei, 'numTextureNames'], [Pointer(T.GLuint), 'textureNames']]));};
T.PFNGLVDPAUISSURFACENVPROC = function() {return Pointer(Fn(null, [[T.GLvdpauSurfaceNV, 'surface']]));};
T.PFNGLVDPAUUNREGISTERSURFACENVPROC = function() {return Pointer(Fn(null, [[T.GLvdpauSurfaceNV, 'surface']]));};
T.PFNGLVDPAUGETSURFACEIVNVPROC = function() {return Pointer(Fn(null, [[T.GLvdpauSurfaceNV, 'surface'], [T.GLenum, 'pname'], [T.GLsizei, 'bufSize'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLint), 'values']]));};
T.PFNGLVDPAUSURFACEACCESSNVPROC = function() {return Pointer(Fn(null, [[T.GLvdpauSurfaceNV, 'surface'], [T.GLenum, 'access']]));};
T.PFNGLVDPAUMAPSURFACESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numSurfaces'], [Pointer(T.GLvdpauSurfaceNV), 'surfaces']]));};
T.PFNGLVDPAUUNMAPSURFACESNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numSurface'], [Pointer(T.GLvdpauSurfaceNV), 'surfaces']]));};
T.PFNGLTEXIMAGE2DMULTISAMPLECOVERAGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLTEXIMAGE3DMULTISAMPLECOVERAGENVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLTEXTUREIMAGE2DMULTISAMPLENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLTEXTUREIMAGE3DMULTISAMPLENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'samples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLTEXTUREIMAGE2DMULTISAMPLECOVERAGENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLTEXTUREIMAGE3DMULTISAMPLECOVERAGENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLsizei, 'coverageSamples'], [T.GLsizei, 'colorSamples'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLboolean, 'fixedSampleLocations']]));};
T.PFNGLSETMULTISAMPLEFVAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pname'], [T.GLuint, 'index'], [Pointer(T.GLfloat), 'val']]));};
T.PFNGLIMPORTSYNCEXTPROC = function() {return Pointer(Fn(T.GLsync, [[T.GLenum, 'external_sync_type'], [T.GLintptr, 'external_sync'], [T.GLbitfield, 'flags']]));};
T.PFNGLMULTIDRAWARRAYSINDIRECTAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [Pointer(T.GLvoid), 'indirect'], [T.GLsizei, 'primcount'], [T.GLsizei, 'stride']]));};
T.PFNGLMULTIDRAWELEMENTSINDIRECTAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'mode'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indirect'], [T.GLsizei, 'primcount'], [T.GLsizei, 'stride']]));};
T.PFNGLGENPATHSNVPROC = function() {return Pointer(Fn(T.GLuint, [[T.GLsizei, 'range']]));};
T.PFNGLDELETEPATHSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'range']]));};
T.PFNGLISPATHNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'path']]));};
T.PFNGLPATHCOMMANDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'numCommands'], [Pointer(T.GLubyte), 'commands'], [T.GLsizei, 'numCoords'], [T.GLenum, 'coordType'], [Pointer(T.GLvoid), 'coords']]));};
T.PFNGLPATHCOORDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'numCoords'], [T.GLenum, 'coordType'], [Pointer(T.GLvoid), 'coords']]));};
T.PFNGLPATHSUBCOMMANDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'commandStart'], [T.GLsizei, 'commandsToDelete'], [T.GLsizei, 'numCommands'], [Pointer(T.GLubyte), 'commands'], [T.GLsizei, 'numCoords'], [T.GLenum, 'coordType'], [Pointer(T.GLvoid), 'coords']]));};
T.PFNGLPATHSUBCOORDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'coordStart'], [T.GLsizei, 'numCoords'], [T.GLenum, 'coordType'], [Pointer(T.GLvoid), 'coords']]));};
T.PFNGLPATHSTRINGNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'format'], [T.GLsizei, 'length'], [Pointer(T.GLvoid), 'pathString']]));};
T.PFNGLPATHGLYPHSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'firstPathName'], [T.GLenum, 'fontTarget'], [Pointer(T.GLvoid), 'fontName'], [T.GLbitfield, 'fontStyle'], [T.GLsizei, 'numGlyphs'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'charcodes'], [T.GLenum, 'handleMissingGlyphs'], [T.GLuint, 'pathParameterTemplate'], [T.GLfloat, 'emScale']]));};
T.PFNGLPATHGLYPHRANGENVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'firstPathName'], [T.GLenum, 'fontTarget'], [Pointer(T.GLvoid), 'fontName'], [T.GLbitfield, 'fontStyle'], [T.GLuint, 'firstGlyph'], [T.GLsizei, 'numGlyphs'], [T.GLenum, 'handleMissingGlyphs'], [T.GLuint, 'pathParameterTemplate'], [T.GLfloat, 'emScale']]));};
T.PFNGLWEIGHTPATHSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'resultPath'], [T.GLsizei, 'numPaths'], [Pointer(T.GLuint), 'paths'], [Pointer(T.GLfloat), 'weights']]));};
T.PFNGLCOPYPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'resultPath'], [T.GLuint, 'srcPath']]));};
T.PFNGLINTERPOLATEPATHSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'resultPath'], [T.GLuint, 'pathA'], [T.GLuint, 'pathB'], [T.GLfloat, 'weight']]));};
T.PFNGLTRANSFORMPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'resultPath'], [T.GLuint, 'srcPath'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'transformValues']]));};
T.PFNGLPATHPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'value']]));};
T.PFNGLPATHPARAMETERINVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [T.GLint, 'value']]));};
T.PFNGLPATHPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLPATHPARAMETERFNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [T.GLfloat, 'value']]));};
T.PFNGLPATHDASHARRAYNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLsizei, 'dashCount'], [Pointer(T.GLfloat), 'dashArray']]));};
T.PFNGLPATHSTENCILFUNCNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'func'], [T.GLint, 'ref'], [T.GLuint, 'mask']]));};
T.PFNGLPATHSTENCILDEPTHOFFSETNVPROC = function() {return Pointer(Fn(null, [[T.GLfloat, 'factor'], [T.GLfloat, 'units']]));};
T.PFNGLSTENCILFILLPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'fillMode'], [T.GLuint, 'mask']]));};
T.PFNGLSTENCILSTROKEPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLint, 'reference'], [T.GLuint, 'mask']]));};
T.PFNGLSTENCILFILLPATHINSTANCEDNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLenum, 'fillMode'], [T.GLuint, 'mask'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'transformValues']]));};
T.PFNGLSTENCILSTROKEPATHINSTANCEDNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLint, 'reference'], [T.GLuint, 'mask'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'transformValues']]));};
T.PFNGLPATHCOVERDEPTHFUNCNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'func']]));};
T.PFNGLPATHCOLORGENNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'color'], [T.GLenum, 'genMode'], [T.GLenum, 'colorFormat'], [Pointer(T.GLfloat), 'coeffs']]));};
T.PFNGLPATHTEXGENNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texCoordSet'], [T.GLenum, 'genMode'], [T.GLint, 'components'], [Pointer(T.GLfloat), 'coeffs']]));};
T.PFNGLPATHFOGGENNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'genMode']]));};
T.PFNGLCOVERFILLPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'coverMode']]));};
T.PFNGLCOVERSTROKEPATHNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'coverMode']]));};
T.PFNGLCOVERFILLPATHINSTANCEDNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLenum, 'coverMode'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'transformValues']]));};
T.PFNGLCOVERSTROKEPATHINSTANCEDNVPROC = function() {return Pointer(Fn(null, [[T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLenum, 'coverMode'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'transformValues']]));};
T.PFNGLGETPATHPARAMETERIVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'value']]));};
T.PFNGLGETPATHPARAMETERFVNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLGETPATHCOMMANDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [Pointer(T.GLubyte), 'commands']]));};
T.PFNGLGETPATHCOORDSNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [Pointer(T.GLfloat), 'coords']]));};
T.PFNGLGETPATHDASHARRAYNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'path'], [Pointer(T.GLfloat), 'dashArray']]));};
T.PFNGLGETPATHMETRICSNVPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'metricQueryMask'], [T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLsizei, 'stride'], [Pointer(T.GLfloat), 'metrics']]));};
T.PFNGLGETPATHMETRICRANGENVPROC = function() {return Pointer(Fn(null, [[T.GLbitfield, 'metricQueryMask'], [T.GLuint, 'firstPathName'], [T.GLsizei, 'numPaths'], [T.GLsizei, 'stride'], [Pointer(T.GLfloat), 'metrics']]));};
T.PFNGLGETPATHSPACINGNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'pathListMode'], [T.GLsizei, 'numPaths'], [T.GLenum, 'pathNameType'], [Pointer(T.GLvoid), 'paths'], [T.GLuint, 'pathBase'], [T.GLfloat, 'advanceScale'], [T.GLfloat, 'kerningScale'], [T.GLenum, 'transformType'], [Pointer(T.GLfloat), 'returnedSpacing']]));};
T.PFNGLGETPATHCOLORGENIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'color'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'value']]));};
T.PFNGLGETPATHCOLORGENFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'color'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLGETPATHTEXGENIVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texCoordSet'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'value']]));};
T.PFNGLGETPATHTEXGENFVNVPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'texCoordSet'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'value']]));};
T.PFNGLISPOINTINFILLPATHNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'path'], [T.GLuint, 'mask'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLISPOINTINSTROKEPATHNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'path'], [T.GLfloat, 'x'], [T.GLfloat, 'y']]));};
T.PFNGLGETPATHLENGTHNVPROC = function() {return Pointer(Fn(T.GLfloat, [[T.GLuint, 'path'], [T.GLsizei, 'startSegment'], [T.GLsizei, 'numSegments']]));};
T.PFNGLPOINTALONGPATHNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint, 'path'], [T.GLsizei, 'startSegment'], [T.GLsizei, 'numSegments'], [T.GLfloat, 'distance'], [Pointer(T.GLfloat), 'x'], [Pointer(T.GLfloat), 'y'], [Pointer(T.GLfloat), 'tangentX'], [Pointer(T.GLfloat), 'tangentY']]));};
T.PFNGLSTENCILOPVALUEAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'face'], [T.GLuint, 'value']]));};
T.PFNGLGETTEXTUREHANDLENVPROC = function() {return Pointer(Fn(T.GLuint64, [[T.GLuint, 'texture']]));};
T.PFNGLGETTEXTURESAMPLERHANDLENVPROC = function() {return Pointer(Fn(T.GLuint64, [[T.GLuint, 'texture'], [T.GLuint, 'sampler']]));};
T.PFNGLMAKETEXTUREHANDLERESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint64, 'handle']]));};
T.PFNGLMAKETEXTUREHANDLENONRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint64, 'handle']]));};
T.PFNGLGETIMAGEHANDLENVPROC = function() {return Pointer(Fn(T.GLuint64, [[T.GLuint, 'texture'], [T.GLint, 'level'], [T.GLboolean, 'layered'], [T.GLint, 'layer'], [T.GLenum, 'format']]));};
T.PFNGLMAKEIMAGEHANDLERESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint64, 'handle'], [T.GLenum, 'access']]));};
T.PFNGLMAKEIMAGEHANDLENONRESIDENTNVPROC = function() {return Pointer(Fn(null, [[T.GLuint64, 'handle']]));};
T.PFNGLUNIFORMHANDLEUI64NVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLuint64, 'value']]));};
T.PFNGLUNIFORMHANDLEUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64), 'value']]));};
T.PFNGLPROGRAMUNIFORMHANDLEUI64NVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLuint64, 'value']]));};
T.PFNGLPROGRAMUNIFORMHANDLEUI64VNVPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'program'], [T.GLint, 'location'], [T.GLsizei, 'count'], [Pointer(T.GLuint64), 'values']]));};
T.PFNGLISTEXTUREHANDLERESIDENTNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint64, 'handle']]));};
T.PFNGLISIMAGEHANDLERESIDENTNVPROC = function() {return Pointer(Fn(T.GLboolean, [[T.GLuint64, 'handle']]));};
T.PFNGLTEXSTORAGESPARSEAMDPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLsizei, 'layers'], [T.GLbitfield, 'flags']]));};
T.PFNGLTEXTURESTORAGESPARSEAMDPROC = function() {return Pointer(Fn(null, [[T.GLuint, 'texture'], [T.GLenum, 'target'], [T.GLenum, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLsizei, 'layers'], [T.GLbitfield, 'flags']]));};
T.GLprogramcallbackMESA = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLvoid), 'data']]));};
T.PFNGLBLENDEQUATIONSEPARATEATIPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'modeRGB'], [T.GLenum, 'modeA']]));};
T.GLeglImageOES = function() {return Pointer(null);};
T.PFNGLEGLIMAGETARGETTEXTURE2DOESPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLeglImageOES, 'image']]));};
T.PFNGLEGLIMAGETARGETRENDERBUFFERSTORAGEOESPROC = function() {return Pointer(Fn(null, [[T.GLenum, 'target'], [T.GLeglImageOES, 'image']]));};
var globals = {
    __ctype_b_loc: function() {return (Fn(Pointer(Pointer(T.u16)), [[null]], [['const']]))('__ctype_b_loc');},
    __ctype_tolower_loc: function() {return (Fn(Pointer(Pointer(T.__int32_t)), [[null]], [['const']]))('__ctype_tolower_loc');},
    __ctype_toupper_loc: function() {return (Fn(Pointer(Pointer(T.__int32_t)), [[null]], [['const']]))('__ctype_toupper_loc');},
    isalnum: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isalnum');},
    isalpha: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isalpha');},
    iscntrl: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('iscntrl');},
    isdigit: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isdigit');},
    islower: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('islower');},
    isgraph: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isgraph');},
    isprint: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isprint');},
    ispunct: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('ispunct');},
    isspace: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isspace');},
    isupper: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isupper');},
    isxdigit: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isxdigit');},
    tolower: function() {return (Fn(T.i32, [[T.i32, '__c']], [['nothrow'], ['leaf']]))('tolower');},
    toupper: function() {return (Fn(T.i32, [[T.i32, '__c']], [['nothrow'], ['leaf']]))('toupper');},
    isblank: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('isblank');},
    isascii: function() {return (Fn(T.i32, [[T.i32, '__c']], [['nothrow'], ['leaf']]))('isascii');},
    toascii: function() {return (Fn(T.i32, [[T.i32, '__c']], [['nothrow'], ['leaf']]))('toascii');},
    _toupper: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('_toupper');},
    _tolower: function() {return (Fn(T.i32, [[T.i32]], [['nothrow'], ['leaf']]))('_tolower');},
    isalnum_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isalnum_l');},
    isalpha_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isalpha_l');},
    iscntrl_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('iscntrl_l');},
    isdigit_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isdigit_l');},
    islower_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('islower_l');},
    isgraph_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isgraph_l');},
    isprint_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isprint_l');},
    ispunct_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('ispunct_l');},
    isspace_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isspace_l');},
    isupper_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isupper_l');},
    isxdigit_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isxdigit_l');},
    isblank_l: function() {return (Fn(T.i32, [[T.i32], [T.__locale_t]], [['nothrow'], ['leaf']]))('isblank_l');},
    __tolower_l: function() {return (Fn(T.i32, [[T.i32, '__c'], [T.__locale_t, '__l']], [['nothrow'], ['leaf']]))('__tolower_l');},
    tolower_l: function() {return (Fn(T.i32, [[T.i32, '__c'], [T.__locale_t, '__l']], [['nothrow'], ['leaf']]))('tolower_l');},
    __toupper_l: function() {return (Fn(T.i32, [[T.i32, '__c'], [T.__locale_t, '__l']], [['nothrow'], ['leaf']]))('__toupper_l');},
    toupper_l: function() {return (Fn(T.i32, [[T.i32, '__c'], [T.__locale_t, '__l']], [['nothrow'], ['leaf']]))('toupper_l');},
    fcntl: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__cmd'], '...']))('fcntl');},
    open: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.i32, '__oflag'], '...'], [['nonnull', {"__rule":"constant","_0":"1"}]]))('open');},
    openat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__file'], [T.i32, '__oflag'], '...'], [['nonnull', {"__rule":"constant","_0":"2"}]]))('openat');},
    creat: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.mode_t, '__mode']], [['nonnull', {"__rule":"constant","_0":"1"}]]))('creat');},
    lockf: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__cmd'], [T.off_t, '__len']]))('lockf');},
    posix_fadvise: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.off_t, '__offset'], [T.off_t, '__len'], [T.i32, '__advise']], [['nothrow'], ['leaf']]))('posix_fadvise');},
    posix_fallocate: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.off_t, '__offset'], [T.off_t, '__len']]))('posix_fallocate');},
    acos: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('acos');},
    __acos: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__acos');},
    asin: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('asin');},
    __asin: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__asin');},
    atan: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('atan');},
    __atan: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__atan');},
    atan2: function() {return (Fn(T.f64, [[T.f64, '__y'], [T.f64, '__x']], [['nothrow'], ['leaf']]))('atan2');},
    __atan2: function() {return (Fn(T.f64, [[T.f64, '__y'], [T.f64, '__x']], [['nothrow'], ['leaf']]))('__atan2');},
    cos: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('cos');},
    __cos: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__cos');},
    sin: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('sin');},
    __sin: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__sin');},
    tan: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('tan');},
    __tan: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__tan');},
    cosh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('cosh');},
    __cosh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__cosh');},
    sinh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('sinh');},
    __sinh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__sinh');},
    tanh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('tanh');},
    __tanh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__tanh');},
    acosh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('acosh');},
    __acosh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__acosh');},
    asinh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('asinh');},
    __asinh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__asinh');},
    atanh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('atanh');},
    __atanh: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__atanh');},
    exp: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('exp');},
    __exp: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__exp');},
    frexp: function() {return (Fn(T.f64, [[T.f64, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('frexp');},
    __frexp: function() {return (Fn(T.f64, [[T.f64, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('__frexp');},
    ldexp: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('ldexp');},
    __ldexp: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('__ldexp');},
    log: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('log');},
    __log: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__log');},
    log10: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('log10');},
    __log10: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__log10');},
    modf: function() {return (Fn(T.f64, [[T.f64, '__x'], [Pointer(T.f64), '__iptr']], [['nothrow'], ['leaf']]))('modf');},
    __modf: function() {return (Fn(T.f64, [[T.f64, '__x'], [Pointer(T.f64), '__iptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('__modf');},
    expm1: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('expm1');},
    __expm1: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__expm1');},
    log1p: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('log1p');},
    __log1p: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__log1p');},
    logb: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('logb');},
    __logb: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__logb');},
    exp2: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('exp2');},
    __exp2: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__exp2');},
    log2: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('log2');},
    __log2: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__log2');},
    pow: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('pow');},
    __pow: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__pow');},
    sqrt: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('sqrt');},
    __sqrt: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__sqrt');},
    hypot: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('hypot');},
    __hypot: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__hypot');},
    cbrt: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('cbrt');},
    __cbrt: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__cbrt');},
    ceil: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('ceil');},
    __ceil: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('__ceil');},
    fabs: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('fabs');},
    __fabs: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('__fabs');},
    floor: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('floor');},
    __floor: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('__floor');},
    fmod: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('fmod');},
    __fmod: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__fmod');},
    __isinf: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isinf');},
    __finite: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('__finite');},
    isinf: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('isinf');},
    finite: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('finite');},
    drem: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('drem');},
    __drem: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__drem');},
    significand: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('significand');},
    __significand: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__significand');},
    copysign: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('copysign');},
    __copysign: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('__copysign');},
    nan: function() {return (Fn(T.f64, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('nan');},
    __nan: function() {return (Fn(T.f64, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('__nan');},
    __isnan: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isnan');},
    isnan: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('isnan');},
    j0: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('j0');},
    __j0: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__j0');},
    j1: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('j1');},
    __j1: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__j1');},
    jn: function() {return (Fn(T.f64, [[T.i32], [T.f64]], [['nothrow'], ['leaf']]))('jn');},
    __jn: function() {return (Fn(T.f64, [[T.i32], [T.f64]], [['nothrow'], ['leaf']]))('__jn');},
    y0: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('y0');},
    __y0: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__y0');},
    y1: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('y1');},
    __y1: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__y1');},
    yn: function() {return (Fn(T.f64, [[T.i32], [T.f64]], [['nothrow'], ['leaf']]))('yn');},
    __yn: function() {return (Fn(T.f64, [[T.i32], [T.f64]], [['nothrow'], ['leaf']]))('__yn');},
    erf: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('erf');},
    __erf: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__erf');},
    erfc: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('erfc');},
    __erfc: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__erfc');},
    lgamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('lgamma');},
    __lgamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__lgamma');},
    tgamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('tgamma');},
    __tgamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__tgamma');},
    gamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('gamma');},
    __gamma: function() {return (Fn(T.f64, [[T.f64]], [['nothrow'], ['leaf']]))('__gamma');},
    lgamma_r: function() {return (Fn(T.f64, [[T.f64], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('lgamma_r');},
    __lgamma_r: function() {return (Fn(T.f64, [[T.f64], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('__lgamma_r');},
    rint: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('rint');},
    __rint: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__rint');},
    nextafter: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('nextafter');},
    __nextafter: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nextafter');},
    nexttoward: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('nexttoward');},
    __nexttoward: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nexttoward');},
    remainder: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('remainder');},
    __remainder: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__remainder');},
    scalbn: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalbn');},
    __scalbn: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalbn');},
    ilogb: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('ilogb');},
    __ilogb: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__ilogb');},
    scalbln: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalbln');},
    __scalbln: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalbln');},
    nearbyint: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('nearbyint');},
    __nearbyint: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__nearbyint');},
    round: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('round');},
    __round: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('__round');},
    trunc: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('trunc');},
    __trunc: function() {return (Fn(T.f64, [[T.f64, '__x']], [['nothrow'], ['leaf'], ['const']]))('__trunc');},
    remquo: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('remquo');},
    __remquo: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('__remquo');},
    lrint: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('lrint');},
    __lrint: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__lrint');},
    llrint: function() {return (Fn(T.i64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('llrint');},
    __llrint: function() {return (Fn(T.i64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__llrint');},
    lround: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('lround');},
    __lround: function() {return (Fn(T.i32, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__lround');},
    llround: function() {return (Fn(T.i64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('llround');},
    __llround: function() {return (Fn(T.i64, [[T.f64, '__x']], [['nothrow'], ['leaf']]))('__llround');},
    fdim: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('fdim');},
    __fdim: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf']]))('__fdim');},
    fmax: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('fmax');},
    __fmax: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fmax');},
    fmin: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('fmin');},
    __fmin: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fmin');},
    __fpclassify: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('__fpclassify');},
    __signbit: function() {return (Fn(T.i32, [[T.f64, '__value']], [['nothrow'], ['leaf'], ['const']]))('__signbit');},
    fma: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y'], [T.f64, '__z']], [['nothrow'], ['leaf']]))('fma');},
    __fma: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__y'], [T.f64, '__z']], [['nothrow'], ['leaf']]))('__fma');},
    scalb: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__n']], [['nothrow'], ['leaf']]))('scalb');},
    __scalb: function() {return (Fn(T.f64, [[T.f64, '__x'], [T.f64, '__n']], [['nothrow'], ['leaf']]))('__scalb');},
    acosf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('acosf');},
    __acosf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__acosf');},
    asinf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('asinf');},
    __asinf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__asinf');},
    atanf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('atanf');},
    __atanf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__atanf');},
    atan2f: function() {return (Fn(T.f32, [[T.f32, '__y'], [T.f32, '__x']], [['nothrow'], ['leaf']]))('atan2f');},
    __atan2f: function() {return (Fn(T.f32, [[T.f32, '__y'], [T.f32, '__x']], [['nothrow'], ['leaf']]))('__atan2f');},
    cosf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('cosf');},
    __cosf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__cosf');},
    sinf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('sinf');},
    __sinf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__sinf');},
    tanf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('tanf');},
    __tanf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__tanf');},
    coshf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('coshf');},
    __coshf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__coshf');},
    sinhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('sinhf');},
    __sinhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__sinhf');},
    tanhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('tanhf');},
    __tanhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__tanhf');},
    acoshf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('acoshf');},
    __acoshf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__acoshf');},
    asinhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('asinhf');},
    __asinhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__asinhf');},
    atanhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('atanhf');},
    __atanhf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__atanhf');},
    expf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('expf');},
    __expf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__expf');},
    frexpf: function() {return (Fn(T.f32, [[T.f32, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('frexpf');},
    __frexpf: function() {return (Fn(T.f32, [[T.f32, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('__frexpf');},
    ldexpf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('ldexpf');},
    __ldexpf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('__ldexpf');},
    logf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('logf');},
    __logf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__logf');},
    log10f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('log10f');},
    __log10f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__log10f');},
    modff: function() {return (Fn(T.f32, [[T.f32, '__x'], [Pointer(T.f32), '__iptr']], [['nothrow'], ['leaf']]))('modff');},
    __modff: function() {return (Fn(T.f32, [[T.f32, '__x'], [Pointer(T.f32), '__iptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('__modff');},
    expm1f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('expm1f');},
    __expm1f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__expm1f');},
    log1pf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('log1pf');},
    __log1pf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__log1pf');},
    logbf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('logbf');},
    __logbf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__logbf');},
    exp2f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('exp2f');},
    __exp2f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__exp2f');},
    log2f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('log2f');},
    __log2f: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__log2f');},
    powf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('powf');},
    __powf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__powf');},
    sqrtf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('sqrtf');},
    __sqrtf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__sqrtf');},
    hypotf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('hypotf');},
    __hypotf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__hypotf');},
    cbrtf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('cbrtf');},
    __cbrtf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__cbrtf');},
    ceilf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('ceilf');},
    __ceilf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('__ceilf');},
    fabsf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('fabsf');},
    __fabsf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('__fabsf');},
    floorf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('floorf');},
    __floorf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('__floorf');},
    fmodf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('fmodf');},
    __fmodf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__fmodf');},
    __isinff: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isinff');},
    __finitef: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('__finitef');},
    isinff: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('isinff');},
    finitef: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('finitef');},
    dremf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('dremf');},
    __dremf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__dremf');},
    significandf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('significandf');},
    __significandf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__significandf');},
    copysignf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('copysignf');},
    __copysignf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('__copysignf');},
    nanf: function() {return (Fn(T.f32, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('nanf');},
    __nanf: function() {return (Fn(T.f32, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('__nanf');},
    __isnanf: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isnanf');},
    isnanf: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('isnanf');},
    j0f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('j0f');},
    __j0f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__j0f');},
    j1f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('j1f');},
    __j1f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__j1f');},
    jnf: function() {return (Fn(T.f32, [[T.i32], [T.f32]], [['nothrow'], ['leaf']]))('jnf');},
    __jnf: function() {return (Fn(T.f32, [[T.i32], [T.f32]], [['nothrow'], ['leaf']]))('__jnf');},
    y0f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('y0f');},
    __y0f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__y0f');},
    y1f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('y1f');},
    __y1f: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__y1f');},
    ynf: function() {return (Fn(T.f32, [[T.i32], [T.f32]], [['nothrow'], ['leaf']]))('ynf');},
    __ynf: function() {return (Fn(T.f32, [[T.i32], [T.f32]], [['nothrow'], ['leaf']]))('__ynf');},
    erff: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('erff');},
    __erff: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__erff');},
    erfcf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('erfcf');},
    __erfcf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__erfcf');},
    lgammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('lgammaf');},
    __lgammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__lgammaf');},
    tgammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('tgammaf');},
    __tgammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__tgammaf');},
    gammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('gammaf');},
    __gammaf: function() {return (Fn(T.f32, [[T.f32]], [['nothrow'], ['leaf']]))('__gammaf');},
    lgammaf_r: function() {return (Fn(T.f32, [[T.f32], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('lgammaf_r');},
    __lgammaf_r: function() {return (Fn(T.f32, [[T.f32], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('__lgammaf_r');},
    rintf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('rintf');},
    __rintf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__rintf');},
    nextafterf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('nextafterf');},
    __nextafterf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nextafterf');},
    nexttowardf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('nexttowardf');},
    __nexttowardf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nexttowardf');},
    remainderf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('remainderf');},
    __remainderf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__remainderf');},
    scalbnf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalbnf');},
    __scalbnf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalbnf');},
    ilogbf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('ilogbf');},
    __ilogbf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__ilogbf');},
    scalblnf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalblnf');},
    __scalblnf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalblnf');},
    nearbyintf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('nearbyintf');},
    __nearbyintf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__nearbyintf');},
    roundf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('roundf');},
    __roundf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('__roundf');},
    truncf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('truncf');},
    __truncf: function() {return (Fn(T.f32, [[T.f32, '__x']], [['nothrow'], ['leaf'], ['const']]))('__truncf');},
    remquof: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('remquof');},
    __remquof: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('__remquof');},
    lrintf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('lrintf');},
    __lrintf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__lrintf');},
    llrintf: function() {return (Fn(T.i64, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('llrintf');},
    __llrintf: function() {return (Fn(T.i64, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__llrintf');},
    lroundf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('lroundf');},
    __lroundf: function() {return (Fn(T.i32, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__lroundf');},
    llroundf: function() {return (Fn(T.i64, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('llroundf');},
    __llroundf: function() {return (Fn(T.i64, [[T.f32, '__x']], [['nothrow'], ['leaf']]))('__llroundf');},
    fdimf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('fdimf');},
    __fdimf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf']]))('__fdimf');},
    fmaxf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('fmaxf');},
    __fmaxf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fmaxf');},
    fminf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('fminf');},
    __fminf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fminf');},
    __fpclassifyf: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('__fpclassifyf');},
    __signbitf: function() {return (Fn(T.i32, [[T.f32, '__value']], [['nothrow'], ['leaf'], ['const']]))('__signbitf');},
    fmaf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y'], [T.f32, '__z']], [['nothrow'], ['leaf']]))('fmaf');},
    __fmaf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__y'], [T.f32, '__z']], [['nothrow'], ['leaf']]))('__fmaf');},
    scalbf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__n']], [['nothrow'], ['leaf']]))('scalbf');},
    __scalbf: function() {return (Fn(T.f32, [[T.f32, '__x'], [T.f32, '__n']], [['nothrow'], ['leaf']]))('__scalbf');},
    acosl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('acosl');},
    __acosl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__acosl');},
    asinl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('asinl');},
    __asinl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__asinl');},
    atanl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('atanl');},
    __atanl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__atanl');},
    atan2l: function() {return (Fn(T.f128, [[T.f128, '__y'], [T.f128, '__x']], [['nothrow'], ['leaf']]))('atan2l');},
    __atan2l: function() {return (Fn(T.f128, [[T.f128, '__y'], [T.f128, '__x']], [['nothrow'], ['leaf']]))('__atan2l');},
    cosl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('cosl');},
    __cosl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__cosl');},
    sinl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('sinl');},
    __sinl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__sinl');},
    tanl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('tanl');},
    __tanl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__tanl');},
    coshl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('coshl');},
    __coshl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__coshl');},
    sinhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('sinhl');},
    __sinhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__sinhl');},
    tanhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('tanhl');},
    __tanhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__tanhl');},
    acoshl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('acoshl');},
    __acoshl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__acoshl');},
    asinhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('asinhl');},
    __asinhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__asinhl');},
    atanhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('atanhl');},
    __atanhl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__atanhl');},
    expl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('expl');},
    __expl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__expl');},
    frexpl: function() {return (Fn(T.f128, [[T.f128, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('frexpl');},
    __frexpl: function() {return (Fn(T.f128, [[T.f128, '__x'], [Pointer(T.i32), '__exponent']], [['nothrow'], ['leaf']]))('__frexpl');},
    ldexpl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('ldexpl');},
    __ldexpl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__exponent']], [['nothrow'], ['leaf']]))('__ldexpl');},
    logl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('logl');},
    __logl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__logl');},
    log10l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('log10l');},
    __log10l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__log10l');},
    modfl: function() {return (Fn(T.f128, [[T.f128, '__x'], [Pointer(T.f128), '__iptr']], [['nothrow'], ['leaf']]))('modfl');},
    __modfl: function() {return (Fn(T.f128, [[T.f128, '__x'], [Pointer(T.f128), '__iptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('__modfl');},
    expm1l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('expm1l');},
    __expm1l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__expm1l');},
    log1pl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('log1pl');},
    __log1pl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__log1pl');},
    logbl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('logbl');},
    __logbl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__logbl');},
    exp2l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('exp2l');},
    __exp2l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__exp2l');},
    log2l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('log2l');},
    __log2l: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__log2l');},
    powl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('powl');},
    __powl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__powl');},
    sqrtl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('sqrtl');},
    __sqrtl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__sqrtl');},
    hypotl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('hypotl');},
    __hypotl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__hypotl');},
    cbrtl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('cbrtl');},
    __cbrtl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__cbrtl');},
    ceill: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('ceill');},
    __ceill: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('__ceill');},
    fabsl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('fabsl');},
    __fabsl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('__fabsl');},
    floorl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('floorl');},
    __floorl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('__floorl');},
    fmodl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('fmodl');},
    __fmodl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__fmodl');},
    __isinfl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isinfl');},
    __finitel: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('__finitel');},
    isinfl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('isinfl');},
    finitel: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('finitel');},
    dreml: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('dreml');},
    __dreml: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__dreml');},
    significandl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('significandl');},
    __significandl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__significandl');},
    copysignl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('copysignl');},
    __copysignl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__copysignl');},
    nanl: function() {return (Fn(T.f128, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('nanl');},
    __nanl: function() {return (Fn(T.f128, [[Pointer(T.char), '__tagb']], [['nothrow'], ['leaf'], ['const']]))('__nanl');},
    __isnanl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('__isnanl');},
    isnanl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('isnanl');},
    j0l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('j0l');},
    __j0l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__j0l');},
    j1l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('j1l');},
    __j1l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__j1l');},
    jnl: function() {return (Fn(T.f128, [[T.i32], [T.f128]], [['nothrow'], ['leaf']]))('jnl');},
    __jnl: function() {return (Fn(T.f128, [[T.i32], [T.f128]], [['nothrow'], ['leaf']]))('__jnl');},
    y0l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('y0l');},
    __y0l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__y0l');},
    y1l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('y1l');},
    __y1l: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__y1l');},
    ynl: function() {return (Fn(T.f128, [[T.i32], [T.f128]], [['nothrow'], ['leaf']]))('ynl');},
    __ynl: function() {return (Fn(T.f128, [[T.i32], [T.f128]], [['nothrow'], ['leaf']]))('__ynl');},
    erfl: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('erfl');},
    __erfl: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__erfl');},
    erfcl: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('erfcl');},
    __erfcl: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__erfcl');},
    lgammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('lgammal');},
    __lgammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__lgammal');},
    tgammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('tgammal');},
    __tgammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__tgammal');},
    gammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('gammal');},
    __gammal: function() {return (Fn(T.f128, [[T.f128]], [['nothrow'], ['leaf']]))('__gammal');},
    lgammal_r: function() {return (Fn(T.f128, [[T.f128], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('lgammal_r');},
    __lgammal_r: function() {return (Fn(T.f128, [[T.f128], [Pointer(T.i32), '__signgamp']], [['nothrow'], ['leaf']]))('__lgammal_r');},
    rintl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('rintl');},
    __rintl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__rintl');},
    nextafterl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('nextafterl');},
    __nextafterl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nextafterl');},
    nexttowardl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('nexttowardl');},
    __nexttowardl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__nexttowardl');},
    remainderl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('remainderl');},
    __remainderl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__remainderl');},
    scalbnl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalbnl');},
    __scalbnl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalbnl');},
    ilogbl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('ilogbl');},
    __ilogbl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__ilogbl');},
    scalblnl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('scalblnl');},
    __scalblnl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('__scalblnl');},
    nearbyintl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('nearbyintl');},
    __nearbyintl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__nearbyintl');},
    roundl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('roundl');},
    __roundl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('__roundl');},
    truncl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('truncl');},
    __truncl: function() {return (Fn(T.f128, [[T.f128, '__x']], [['nothrow'], ['leaf'], ['const']]))('__truncl');},
    remquol: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('remquol');},
    __remquol: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y'], [Pointer(T.i32), '__quo']], [['nothrow'], ['leaf']]))('__remquol');},
    lrintl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('lrintl');},
    __lrintl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__lrintl');},
    llrintl: function() {return (Fn(T.i64, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('llrintl');},
    __llrintl: function() {return (Fn(T.i64, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__llrintl');},
    lroundl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('lroundl');},
    __lroundl: function() {return (Fn(T.i32, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__lroundl');},
    llroundl: function() {return (Fn(T.i64, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('llroundl');},
    __llroundl: function() {return (Fn(T.i64, [[T.f128, '__x']], [['nothrow'], ['leaf']]))('__llroundl');},
    fdiml: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('fdiml');},
    __fdiml: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf']]))('__fdiml');},
    fmaxl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('fmaxl');},
    __fmaxl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fmaxl');},
    fminl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('fminl');},
    __fminl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y']], [['nothrow'], ['leaf'], ['const']]))('__fminl');},
    __fpclassifyl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('__fpclassifyl');},
    __signbitl: function() {return (Fn(T.i32, [[T.f128, '__value']], [['nothrow'], ['leaf'], ['const']]))('__signbitl');},
    fmal: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y'], [T.f128, '__z']], [['nothrow'], ['leaf']]))('fmal');},
    __fmal: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__y'], [T.f128, '__z']], [['nothrow'], ['leaf']]))('__fmal');},
    scalbl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__n']], [['nothrow'], ['leaf']]))('scalbl');},
    __scalbl: function() {return (Fn(T.f128, [[T.f128, '__x'], [T.f128, '__n']], [['nothrow'], ['leaf']]))('__scalbl');},
    signgam: function() {return (T.i32)('signgam');},
    _LIB_VERSION: function() {return (T._LIB_VERSION_TYPE)('_LIB_VERSION');},
    matherr: function() {return (Fn(T.i32, [[Pointer(Struct('exception', null)), '__exc']]))('matherr');},
    __sched_cpucount: function() {return (Fn(T.i32, [[T.size_t, '__setsize'], [Pointer(T.cpu_set_t), '__setp']], [['nothrow'], ['leaf']]))('__sched_cpucount');},
    __sched_cpualloc: function() {return (Fn(Pointer(T.cpu_set_t), [[T.size_t, '__count']]))('__sched_cpualloc');},
    __sched_cpufree: function() {return (Fn(null, [[Pointer(T.cpu_set_t), '__set']], [['nothrow'], ['leaf']]))('__sched_cpufree');},
    sched_setparam: function() {return (Fn(T.i32, [[T.__pid_t, '__pid'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf']]))('sched_setparam');},
    sched_getparam: function() {return (Fn(T.i32, [[T.__pid_t, '__pid'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf']]))('sched_getparam');},
    sched_setscheduler: function() {return (Fn(T.i32, [[T.__pid_t, '__pid'], [T.i32, '__policy'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf']]))('sched_setscheduler');},
    sched_getscheduler: function() {return (Fn(T.i32, [[T.__pid_t, '__pid']], [['nothrow'], ['leaf']]))('sched_getscheduler');},
    sched_yield: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('sched_yield');},
    sched_get_priority_max: function() {return (Fn(T.i32, [[T.i32, '__algorithm']], [['nothrow'], ['leaf']]))('sched_get_priority_max');},
    sched_get_priority_min: function() {return (Fn(T.i32, [[T.i32, '__algorithm']], [['nothrow'], ['leaf']]))('sched_get_priority_min');},
    sched_rr_get_interval: function() {return (Fn(T.i32, [[T.__pid_t, '__pid'], [Pointer(Struct('timespec', null)), '__t']], [['nothrow'], ['leaf']]))('sched_rr_get_interval');},
    clock: function() {return (Fn(T.clock_t, [[null]], [['nothrow'], ['leaf']]))('clock');},
    time: function() {return (Fn(T.time_t, [[Pointer(T.time_t), '__timer']], [['nothrow'], ['leaf']]))('time');},
    difftime: function() {return (Fn(T.f64, [[T.time_t, '__time1'], [T.time_t, '__time0']], [['nothrow'], ['leaf'], ['const']]))('difftime');},
    mktime: function() {return (Fn(T.time_t, [[Pointer(Struct('tm', null)), '__tp']], [['nothrow'], ['leaf']]))('mktime');},
    strftime: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [T.size_t, '__maxsize'], [Pointer(T.char), '__format'], [Pointer(Struct('tm', null)), '__tp']], [['nothrow'], ['leaf']]))('strftime');},
    strftime_l: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [T.size_t, '__maxsize'], [Pointer(T.char), '__format'], [Pointer(Struct('tm', null)), '__tp'], [T.__locale_t, '__loc']], [['nothrow'], ['leaf']]))('strftime_l');},
    gmtime: function() {return (Fn(Pointer(Struct('tm', null)), [[Pointer(T.time_t), '__timer']]))('gmtime');},
    localtime: function() {return (Fn(Pointer(Struct('tm', null)), [[Pointer(T.time_t), '__timer']]))('localtime');},
    gmtime_r: function() {return (Fn(Pointer(Struct('tm', null)), [[Pointer(T.time_t), '__timer'], [Pointer(Struct('tm', null)), '__tp']]))('gmtime_r');},
    localtime_r: function() {return (Fn(Pointer(Struct('tm', null)), [[Pointer(T.time_t), '__timer'], [Pointer(Struct('tm', null)), '__tp']]))('localtime_r');},
    asctime: function() {return (Fn(Pointer(T.char), [[Pointer(Struct('tm', null)), '__tp']]))('asctime');},
    ctime: function() {return (Fn(Pointer(T.char), [[Pointer(T.time_t), '__timer']]))('ctime');},
    asctime_r: function() {return (Fn(Pointer(T.char), [[Pointer(Struct('tm', null)), '__tp'], [Pointer(T.char), '__buf']]))('asctime_r');},
    ctime_r: function() {return (Fn(Pointer(T.char), [[Pointer(T.time_t), '__timer'], [Pointer(T.char), '__buf']]))('ctime_r');},
    __tzname: function() {return (ArrayType(Pointer(T.char), 2))('__tzname');},
    __daylight: function() {return (T.i32)('__daylight');},
    __timezone: function() {return (T.i32)('__timezone');},
    tzname: function() {return (ArrayType(Pointer(T.char), 2))('tzname');},
    tzset: function() {return (Fn(null, [[null]], [['nothrow'], ['leaf']]))('tzset');},
    daylight: function() {return (T.i32)('daylight');},
    timezone: function() {return (T.i32)('timezone');},
    stime: function() {return (Fn(T.i32, [[Pointer(T.time_t), '__when']], [['nothrow'], ['leaf']]))('stime');},
    timegm: function() {return (Fn(T.time_t, [[Pointer(Struct('tm', null)), '__tp']], [['nothrow'], ['leaf']]))('timegm');},
    timelocal: function() {return (Fn(T.time_t, [[Pointer(Struct('tm', null)), '__tp']], [['nothrow'], ['leaf']]))('timelocal');},
    dysize: function() {return (Fn(T.i32, [[T.i32, '__year']], [['nothrow'], ['leaf'], ['const']]))('dysize');},
    nanosleep: function() {return (Fn(T.i32, [[Pointer(Struct('timespec', null)), '__requested_time'], [Pointer(Struct('timespec', null)), '__remaining']]))('nanosleep');},
    clock_getres: function() {return (Fn(T.i32, [[T.clockid_t, '__clock_id'], [Pointer(Struct('timespec', null)), '__res']], [['nothrow'], ['leaf']]))('clock_getres');},
    clock_gettime: function() {return (Fn(T.i32, [[T.clockid_t, '__clock_id'], [Pointer(Struct('timespec', null)), '__tp']], [['nothrow'], ['leaf']]))('clock_gettime');},
    clock_settime: function() {return (Fn(T.i32, [[T.clockid_t, '__clock_id'], [Pointer(Struct('timespec', null)), '__tp']], [['nothrow'], ['leaf']]))('clock_settime');},
    clock_nanosleep: function() {return (Fn(T.i32, [[T.clockid_t, '__clock_id'], [T.i32, '__flags'], [Pointer(Struct('timespec', null)), '__req'], [Pointer(Struct('timespec', null)), '__rem']]))('clock_nanosleep');},
    clock_getcpuclockid: function() {return (Fn(T.i32, [[T.pid_t, '__pid'], [Pointer(T.clockid_t), '__clock_id']], [['nothrow'], ['leaf']]))('clock_getcpuclockid');},
    timer_create: function() {return (Fn(T.i32, [[T.clockid_t, '__clock_id'], [Pointer(Struct('sigevent', null)), '__evp'], [Pointer(T.timer_t), '__timerid']], [['nothrow'], ['leaf']]))('timer_create');},
    timer_delete: function() {return (Fn(T.i32, [[T.timer_t, '__timerid']], [['nothrow'], ['leaf']]))('timer_delete');},
    timer_settime: function() {return (Fn(T.i32, [[T.timer_t, '__timerid'], [T.i32, '__flags'], [Pointer(Struct('itimerspec', null)), '__value'], [Pointer(Struct('itimerspec', null)), '__ovalue']], [['nothrow'], ['leaf']]))('timer_settime');},
    timer_gettime: function() {return (Fn(T.i32, [[T.timer_t, '__timerid'], [Pointer(Struct('itimerspec', null)), '__value']], [['nothrow'], ['leaf']]))('timer_gettime');},
    timer_getoverrun: function() {return (Fn(T.i32, [[T.timer_t, '__timerid']], [['nothrow'], ['leaf']]))('timer_getoverrun');},
    pthread_create: function() {return (Fn(T.i32, [[Pointer(T.pthread_t), '__newthread'], [Pointer(T.pthread_attr_t), '__attr'], [Pointer(Fn(Pointer(null), [[Pointer(null)]])), '__start_routine'], [Pointer(null), '__arg']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"3"}]]))('pthread_create');},
    pthread_exit: function() {return (Fn(null, [[Pointer(null), '__retval']], [['noreturn']]))('pthread_exit');},
    pthread_join: function() {return (Fn(T.i32, [[T.pthread_t, '__th'], [Pointer(Pointer(null)), '__thread_return']]))('pthread_join');},
    pthread_detach: function() {return (Fn(T.i32, [[T.pthread_t, '__th']], [['nothrow'], ['leaf']]))('pthread_detach');},
    pthread_self: function() {return (Fn(T.pthread_t, [[null]], [['nothrow'], ['leaf'], ['const']]))('pthread_self');},
    pthread_equal: function() {return (Fn(T.i32, [[T.pthread_t, '__thread1'], [T.pthread_t, '__thread2']], [['nothrow'], ['leaf'], ['const']]))('pthread_equal');},
    pthread_attr_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_init');},
    pthread_attr_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_destroy');},
    pthread_attr_getdetachstate: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.i32), '__detachstate']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getdetachstate');},
    pthread_attr_setdetachstate: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.i32, '__detachstate']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setdetachstate');},
    pthread_attr_getguardsize: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.size_t), '__guardsize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getguardsize');},
    pthread_attr_setguardsize: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.size_t, '__guardsize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setguardsize');},
    pthread_attr_getschedparam: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getschedparam');},
    pthread_attr_setschedparam: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_setschedparam');},
    pthread_attr_getschedpolicy: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.i32), '__policy']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getschedpolicy');},
    pthread_attr_setschedpolicy: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.i32, '__policy']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setschedpolicy');},
    pthread_attr_getinheritsched: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.i32), '__inherit']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getinheritsched');},
    pthread_attr_setinheritsched: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.i32, '__inherit']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setinheritsched');},
    pthread_attr_getscope: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.i32), '__scope']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getscope');},
    pthread_attr_setscope: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.i32, '__scope']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setscope');},
    pthread_attr_getstackaddr: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(Pointer(null)), '__stackaddr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}], ['deprecated']]))('pthread_attr_getstackaddr');},
    pthread_attr_setstackaddr: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(null), '__stackaddr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}], ['deprecated']]))('pthread_attr_setstackaddr');},
    pthread_attr_getstacksize: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(T.size_t), '__stacksize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_attr_getstacksize');},
    pthread_attr_setstacksize: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [T.size_t, '__stacksize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setstacksize');},
    pthread_attr_getstack: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(Pointer(null)), '__stackaddr'], [Pointer(T.size_t), '__stacksize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('pthread_attr_getstack');},
    pthread_attr_setstack: function() {return (Fn(T.i32, [[Pointer(T.pthread_attr_t), '__attr'], [Pointer(null), '__stackaddr'], [T.size_t, '__stacksize']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_attr_setstack');},
    pthread_setschedparam: function() {return (Fn(T.i32, [[T.pthread_t, '__target_thread'], [T.i32, '__policy'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}]]))('pthread_setschedparam');},
    pthread_getschedparam: function() {return (Fn(T.i32, [[T.pthread_t, '__target_thread'], [Pointer(T.i32), '__policy'], [Pointer(Struct('sched_param', null)), '__param']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('pthread_getschedparam');},
    pthread_setschedprio: function() {return (Fn(T.i32, [[T.pthread_t, '__target_thread'], [T.i32, '__prio']], [['nothrow'], ['leaf']]))('pthread_setschedprio');},
    pthread_once: function() {return (Fn(T.i32, [[Pointer(T.pthread_once_t), '__once_control'], [Pointer(Fn(null, [[null]])), '__init_routine']], [['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_once');},
    pthread_setcancelstate: function() {return (Fn(T.i32, [[T.i32, '__state'], [Pointer(T.i32), '__oldstate']]))('pthread_setcancelstate');},
    pthread_setcanceltype: function() {return (Fn(T.i32, [[T.i32, '__type'], [Pointer(T.i32), '__oldtype']]))('pthread_setcanceltype');},
    pthread_cancel: function() {return (Fn(T.i32, [[T.pthread_t, '__th']]))('pthread_cancel');},
    pthread_testcancel: function() {return (Fn(null, [[null]]))('pthread_testcancel');},
    __pthread_register_cancel: function() {return (Fn(null, [[Pointer(T.__pthread_unwind_buf_t), '__buf']], [['regparm', {"__rule":"constant","_0":"1"}]]))('__pthread_register_cancel');},
    __pthread_unregister_cancel: function() {return (Fn(null, [[Pointer(T.__pthread_unwind_buf_t), '__buf']], [['regparm', {"__rule":"constant","_0":"1"}]]))('__pthread_unregister_cancel');},
    __pthread_unwind_next: function() {return (Fn(null, [[Pointer(T.__pthread_unwind_buf_t), '__buf']], [['regparm', {"__rule":"constant","_0":"1"}], ['noreturn'], ['weak']]))('__pthread_unwind_next');},
    __sigsetjmp: function() {return (Fn(T.i32, [[Pointer(Struct('__jmp_buf_tag', null)), '__env'], [T.i32, '__savemask']], [['nothrow']]))('__sigsetjmp');},
    pthread_mutex_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex'], [Pointer(T.pthread_mutexattr_t), '__mutexattr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_init');},
    pthread_mutex_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_destroy');},
    pthread_mutex_trylock: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_trylock');},
    pthread_mutex_lock: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_lock');},
    pthread_mutex_timedlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex'], [Pointer(Struct('timespec', null)), '__abstime']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutex_timedlock');},
    pthread_mutex_unlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_unlock');},
    pthread_mutex_getprioceiling: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex'], [Pointer(T.i32), '__prioceiling']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutex_getprioceiling');},
    pthread_mutex_setprioceiling: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex'], [T.i32, '__prioceiling'], [Pointer(T.i32), '__old_ceiling']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"3"}]]))('pthread_mutex_setprioceiling');},
    pthread_mutex_consistent: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutex_t), '__mutex']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutex_consistent');},
    pthread_mutexattr_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_init');},
    pthread_mutexattr_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_destroy');},
    pthread_mutexattr_getpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [Pointer(T.i32), '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutexattr_getpshared');},
    pthread_mutexattr_setpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [T.i32, '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_setpshared');},
    pthread_mutexattr_gettype: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [Pointer(T.i32), '__kind']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutexattr_gettype');},
    pthread_mutexattr_settype: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [T.i32, '__kind']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_settype');},
    pthread_mutexattr_getprotocol: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [Pointer(T.i32), '__protocol']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutexattr_getprotocol');},
    pthread_mutexattr_setprotocol: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [T.i32, '__protocol']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_setprotocol');},
    pthread_mutexattr_getprioceiling: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [Pointer(T.i32), '__prioceiling']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutexattr_getprioceiling');},
    pthread_mutexattr_setprioceiling: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [T.i32, '__prioceiling']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_setprioceiling');},
    pthread_mutexattr_getrobust: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [Pointer(T.i32), '__robustness']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_mutexattr_getrobust');},
    pthread_mutexattr_setrobust: function() {return (Fn(T.i32, [[Pointer(T.pthread_mutexattr_t), '__attr'], [T.i32, '__robustness']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_mutexattr_setrobust');},
    pthread_rwlock_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock'], [Pointer(T.pthread_rwlockattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_init');},
    pthread_rwlock_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_destroy');},
    pthread_rwlock_rdlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_rdlock');},
    pthread_rwlock_tryrdlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_tryrdlock');},
    pthread_rwlock_timedrdlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock'], [Pointer(Struct('timespec', null)), '__abstime']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_rwlock_timedrdlock');},
    pthread_rwlock_wrlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_wrlock');},
    pthread_rwlock_trywrlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_trywrlock');},
    pthread_rwlock_timedwrlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock'], [Pointer(Struct('timespec', null)), '__abstime']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_rwlock_timedwrlock');},
    pthread_rwlock_unlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlock_t), '__rwlock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlock_unlock');},
    pthread_rwlockattr_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlockattr_init');},
    pthread_rwlockattr_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlockattr_destroy');},
    pthread_rwlockattr_getpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr'], [Pointer(T.i32), '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_rwlockattr_getpshared');},
    pthread_rwlockattr_setpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr'], [T.i32, '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlockattr_setpshared');},
    pthread_rwlockattr_getkind_np: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr'], [Pointer(T.i32), '__pref']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_rwlockattr_getkind_np');},
    pthread_rwlockattr_setkind_np: function() {return (Fn(T.i32, [[Pointer(T.pthread_rwlockattr_t), '__attr'], [T.i32, '__pref']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_rwlockattr_setkind_np');},
    pthread_cond_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond'], [Pointer(T.pthread_condattr_t), '__cond_attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_cond_init');},
    pthread_cond_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_cond_destroy');},
    pthread_cond_signal: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_cond_signal');},
    pthread_cond_broadcast: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_cond_broadcast');},
    pthread_cond_wait: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond'], [Pointer(T.pthread_mutex_t), '__mutex']], [['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_cond_wait');},
    pthread_cond_timedwait: function() {return (Fn(T.i32, [[Pointer(T.pthread_cond_t), '__cond'], [Pointer(T.pthread_mutex_t), '__mutex'], [Pointer(Struct('timespec', null)), '__abstime']], [['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('pthread_cond_timedwait');},
    pthread_condattr_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_condattr_init');},
    pthread_condattr_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_condattr_destroy');},
    pthread_condattr_getpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr'], [Pointer(T.i32), '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_condattr_getpshared');},
    pthread_condattr_setpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr'], [T.i32, '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_condattr_setpshared');},
    pthread_condattr_getclock: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr'], [Pointer(T.__clockid_t), '__clock_id']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_condattr_getclock');},
    pthread_condattr_setclock: function() {return (Fn(T.i32, [[Pointer(T.pthread_condattr_t), '__attr'], [T.__clockid_t, '__clock_id']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_condattr_setclock');},
    pthread_spin_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_spinlock_t), '__lock'], [T.i32, '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_spin_init');},
    pthread_spin_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_spinlock_t), '__lock']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_spin_destroy');},
    pthread_spin_lock: function() {return (Fn(T.i32, [[Pointer(T.pthread_spinlock_t), '__lock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_spin_lock');},
    pthread_spin_trylock: function() {return (Fn(T.i32, [[Pointer(T.pthread_spinlock_t), '__lock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_spin_trylock');},
    pthread_spin_unlock: function() {return (Fn(T.i32, [[Pointer(T.pthread_spinlock_t), '__lock']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_spin_unlock');},
    pthread_barrier_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrier_t), '__barrier'], [Pointer(T.pthread_barrierattr_t), '__attr'], [T.u32, '__count']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrier_init');},
    pthread_barrier_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrier_t), '__barrier']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrier_destroy');},
    pthread_barrier_wait: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrier_t), '__barrier']], [['nothrow'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrier_wait');},
    pthread_barrierattr_init: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrierattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrierattr_init');},
    pthread_barrierattr_destroy: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrierattr_t), '__attr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrierattr_destroy');},
    pthread_barrierattr_getpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrierattr_t), '__attr'], [Pointer(T.i32), '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('pthread_barrierattr_getpshared');},
    pthread_barrierattr_setpshared: function() {return (Fn(T.i32, [[Pointer(T.pthread_barrierattr_t), '__attr'], [T.i32, '__pshared']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_barrierattr_setpshared');},
    pthread_key_create: function() {return (Fn(T.i32, [[Pointer(T.pthread_key_t), '__key'], [Pointer(Fn(null, [[Pointer(null)]])), '__destr_function']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pthread_key_create');},
    pthread_key_delete: function() {return (Fn(T.i32, [[T.pthread_key_t, '__key']], [['nothrow'], ['leaf']]))('pthread_key_delete');},
    pthread_getspecific: function() {return (Fn(Pointer(null), [[T.pthread_key_t, '__key']]))('pthread_getspecific');},
    pthread_setspecific: function() {return (Fn(T.i32, [[T.pthread_key_t, '__key'], [Pointer(null), '__pointer']], [['nothrow'], ['leaf']]))('pthread_setspecific');},
    pthread_getcpuclockid: function() {return (Fn(T.i32, [[T.pthread_t, '__thread_id'], [Pointer(T.__clockid_t), '__clock_id']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('pthread_getcpuclockid');},
    pthread_atfork: function() {return (Fn(T.i32, [[Pointer(Fn(null, [[null]])), '__prepare'], [Pointer(Fn(null, [[null]])), '__parent'], [Pointer(Fn(null, [[null]])), '__child']], [['nothrow'], ['leaf']]))('pthread_atfork');},
    _IO_2_1_stdin_: function() {return (Struct('_IO_FILE_plus', null))('_IO_2_1_stdin_');},
    _IO_2_1_stdout_: function() {return (Struct('_IO_FILE_plus', null))('_IO_2_1_stdout_');},
    _IO_2_1_stderr_: function() {return (Struct('_IO_FILE_plus', null))('_IO_2_1_stderr_');},
    __underflow: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)]]))('__underflow');},
    __uflow: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)]]))('__uflow');},
    __overflow: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)], [T.i32]]))('__overflow');},
    _IO_getc: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE), '__fp']]))('_IO_getc');},
    _IO_putc: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T._IO_FILE), '__fp']]))('_IO_putc');},
    _IO_feof: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE), '__fp']], [['nothrow'], ['leaf']]))('_IO_feof');},
    _IO_ferror: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE), '__fp']], [['nothrow'], ['leaf']]))('_IO_ferror');},
    _IO_peekc_locked: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE), '__fp']]))('_IO_peekc_locked');},
    _IO_flockfile: function() {return (Fn(null, [[Pointer(T._IO_FILE)]], [['nothrow'], ['leaf']]))('_IO_flockfile');},
    _IO_funlockfile: function() {return (Fn(null, [[Pointer(T._IO_FILE)]], [['nothrow'], ['leaf']]))('_IO_funlockfile');},
    _IO_ftrylockfile: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)]], [['nothrow'], ['leaf']]))('_IO_ftrylockfile');},
    _IO_vfscanf: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)], [Pointer(T.char)], [T.__gnuc_va_list], [Pointer(T.i32)]]))('_IO_vfscanf');},
    _IO_vfprintf: function() {return (Fn(T.i32, [[Pointer(T._IO_FILE)], [Pointer(T.char)], [T.__gnuc_va_list]]))('_IO_vfprintf');},
    _IO_padn: function() {return (Fn(T.__ssize_t, [[Pointer(T._IO_FILE)], [T.i32], [T.__ssize_t]]))('_IO_padn');},
    _IO_sgetn: function() {return (Fn(T.size_t, [[Pointer(T._IO_FILE)], [Pointer(null)], [T.size_t]]))('_IO_sgetn');},
    _IO_seekoff: function() {return (Fn(T.__off64_t, [[Pointer(T._IO_FILE)], [T.__off64_t], [T.i32], [T.i32]]))('_IO_seekoff');},
    _IO_seekpos: function() {return (Fn(T.__off64_t, [[Pointer(T._IO_FILE)], [T.__off64_t], [T.i32]]))('_IO_seekpos');},
    _IO_free_backup_area: function() {return (Fn(null, [[Pointer(T._IO_FILE)]], [['nothrow'], ['leaf']]))('_IO_free_backup_area');},
    stdin: function() {return (Pointer(Struct('_IO_FILE', null)))('stdin');},
    stdout: function() {return (Pointer(Struct('_IO_FILE', null)))('stdout');},
    stderr: function() {return (Pointer(Struct('_IO_FILE', null)))('stderr');},
    remove: function() {return (Fn(T.i32, [[Pointer(T.char), '__filename']], [['nothrow'], ['leaf']]))('remove');},
    rename: function() {return (Fn(T.i32, [[Pointer(T.char), '__old'], [Pointer(T.char), '__new']], [['nothrow'], ['leaf']]))('rename');},
    renameat: function() {return (Fn(T.i32, [[T.i32, '__oldfd'], [Pointer(T.char), '__old'], [T.i32, '__newfd'], [Pointer(T.char), '__new']], [['nothrow'], ['leaf']]))('renameat');},
    tmpfile: function() {return (Fn(Pointer(T.FILE), [[null]]))('tmpfile');},
    tmpnam: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s']]))('tmpnam');},
    tmpnam_r: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s']]))('tmpnam_r');},
    tempnam: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dir'], [Pointer(T.char), '__pfx']]))('tempnam');},
    fclose: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('fclose');},
    fflush: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('fflush');},
    fflush_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('fflush_unlocked');},
    fopen: function() {return (Fn(Pointer(T.FILE), [[Pointer(T.char), '__filename'], [Pointer(T.char), '__modes']]))('fopen');},
    freopen: function() {return (Fn(Pointer(T.FILE), [[Pointer(T.char), '__filename'], [Pointer(T.char), '__modes'], [Pointer(T.FILE), '__stream']]))('freopen');},
    fdopen: function() {return (Fn(Pointer(T.FILE), [[T.i32, '__fd'], [Pointer(T.char), '__modes']]))('fdopen');},
    fmemopen: function() {return (Fn(Pointer(T.FILE), [[Pointer(null), '__s'], [T.size_t, '__len'], [Pointer(T.char), '__modes']]))('fmemopen');},
    open_memstream: function() {return (Fn(Pointer(T.FILE), [[Pointer(Pointer(T.char)), '__bufloc'], [Pointer(T.size_t), '__sizeloc']]))('open_memstream');},
    setbuf: function() {return (Fn(null, [[Pointer(T.FILE), '__stream'], [Pointer(T.char), '__buf']], [['nothrow'], ['leaf']]))('setbuf');},
    setvbuf: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [Pointer(T.char), '__buf'], [T.i32, '__modes'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('setvbuf');},
    setbuffer: function() {return (Fn(null, [[Pointer(T.FILE), '__stream'], [Pointer(T.char), '__buf'], [T.size_t, '__size']], [['nothrow'], ['leaf']]))('setbuffer');},
    setlinebuf: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('setlinebuf');},
    fprintf: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [Pointer(T.char), '__format'], '...']))('fprintf');},
    printf: function() {return (Fn(T.i32, [[Pointer(T.char), '__format'], '...']))('printf');},
    sprintf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [Pointer(T.char), '__format'], '...'], [['nothrow']]))('sprintf');},
    vfprintf: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__s'], [Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']]))('vfprintf');},
    vprintf: function() {return (Fn(T.i32, [[Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']]))('vprintf');},
    vsprintf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']], [['nothrow']]))('vsprintf');},
    snprintf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [T.size_t, '__maxlen'], [Pointer(T.char), '__format'], '...'], [['nothrow'], ['format', '__printf__', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}]]))('snprintf');},
    vsnprintf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [T.size_t, '__maxlen'], [Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']], [['nothrow'], ['format', '__printf__', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"0"}]]))('vsnprintf');},
    vdprintf: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__fmt'], [T.__gnuc_va_list, '__arg']], [['format', '__printf__', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"0"}]]))('vdprintf');},
    dprintf: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__fmt'], '...'], [['format', '__printf__', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('dprintf');},
    fscanf: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [Pointer(T.char), '__format'], '...']))('fscanf');},
    scanf: function() {return (Fn(T.i32, [[Pointer(T.char), '__format'], '...']))('scanf');},
    sscanf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [Pointer(T.char), '__format'], '...'], [['nothrow'], ['leaf']]))('sscanf');},
    vfscanf: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__s'], [Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']], [['format', '__scanf__', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"0"}]]))('vfscanf');},
    vscanf: function() {return (Fn(T.i32, [[Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']], [['format', '__scanf__', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"0"}]]))('vscanf');},
    vsscanf: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [Pointer(T.char), '__format'], [T.__gnuc_va_list, '__arg']], [['nothrow'], ['leaf'], ['format', '__scanf__', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"0"}]]))('vsscanf');},
    fgetc: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('fgetc');},
    getc: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('getc');},
    getchar: function() {return (Fn(T.i32, [[null]]))('getchar');},
    getc_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('getc_unlocked');},
    getchar_unlocked: function() {return (Fn(T.i32, [[null]]))('getchar_unlocked');},
    fgetc_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('fgetc_unlocked');},
    fputc: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T.FILE), '__stream']]))('fputc');},
    putc: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T.FILE), '__stream']]))('putc');},
    putchar: function() {return (Fn(T.i32, [[T.i32, '__c']]))('putchar');},
    fputc_unlocked: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T.FILE), '__stream']]))('fputc_unlocked');},
    putc_unlocked: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T.FILE), '__stream']]))('putc_unlocked');},
    putchar_unlocked: function() {return (Fn(T.i32, [[T.i32, '__c']]))('putchar_unlocked');},
    getw: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('getw');},
    putw: function() {return (Fn(T.i32, [[T.i32, '__w'], [Pointer(T.FILE), '__stream']]))('putw');},
    fgets: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [T.i32, '__n'], [Pointer(T.FILE), '__stream']]))('fgets');},
    gets: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s']]))('gets');},
    __getdelim: function() {return (Fn(T.__ssize_t, [[Pointer(Pointer(T.char)), '__lineptr'], [Pointer(T.size_t), '__n'], [T.i32, '__delimiter'], [Pointer(T.FILE), '__stream']]))('__getdelim');},
    getdelim: function() {return (Fn(T.__ssize_t, [[Pointer(Pointer(T.char)), '__lineptr'], [Pointer(T.size_t), '__n'], [T.i32, '__delimiter'], [Pointer(T.FILE), '__stream']]))('getdelim');},
    getline: function() {return (Fn(T.__ssize_t, [[Pointer(Pointer(T.char)), '__lineptr'], [Pointer(T.size_t), '__n'], [Pointer(T.FILE), '__stream']]))('getline');},
    fputs: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [Pointer(T.FILE), '__stream']]))('fputs');},
    puts: function() {return (Fn(T.i32, [[Pointer(T.char), '__s']]))('puts');},
    ungetc: function() {return (Fn(T.i32, [[T.i32, '__c'], [Pointer(T.FILE), '__stream']]))('ungetc');},
    fread: function() {return (Fn(T.size_t, [[Pointer(null), '__ptr'], [T.size_t, '__size'], [T.size_t, '__n'], [Pointer(T.FILE), '__stream']]))('fread');},
    fwrite: function() {return (Fn(T.size_t, [[Pointer(null), '__ptr'], [T.size_t, '__size'], [T.size_t, '__n'], [Pointer(T.FILE), '__s']]))('fwrite');},
    fread_unlocked: function() {return (Fn(T.size_t, [[Pointer(null), '__ptr'], [T.size_t, '__size'], [T.size_t, '__n'], [Pointer(T.FILE), '__stream']]))('fread_unlocked');},
    fwrite_unlocked: function() {return (Fn(T.size_t, [[Pointer(null), '__ptr'], [T.size_t, '__size'], [T.size_t, '__n'], [Pointer(T.FILE), '__stream']]))('fwrite_unlocked');},
    fseek: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [T.i32, '__off'], [T.i32, '__whence']]))('fseek');},
    ftell: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('ftell');},
    rewind: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']]))('rewind');},
    fseeko: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [T.__off_t, '__off'], [T.i32, '__whence']]))('fseeko');},
    ftello: function() {return (Fn(T.__off_t, [[Pointer(T.FILE), '__stream']]))('ftello');},
    fgetpos: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [Pointer(T.fpos_t), '__pos']]))('fgetpos');},
    fsetpos: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream'], [Pointer(T.fpos_t), '__pos']]))('fsetpos');},
    clearerr: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('clearerr');},
    feof: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('feof');},
    ferror: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('ferror');},
    clearerr_unlocked: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('clearerr_unlocked');},
    feof_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('feof_unlocked');},
    ferror_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('ferror_unlocked');},
    perror: function() {return (Fn(null, [[Pointer(T.char), '__s']]))('perror');},
    sys_nerr: function() {return (T.i32)('sys_nerr');},
    sys_errlist: function() {return (Pointer(Pointer(T.char), [['const'], ['const']]))('sys_errlist');},
    fileno: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('fileno');},
    fileno_unlocked: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('fileno_unlocked');},
    popen: function() {return (Fn(Pointer(T.FILE), [[Pointer(T.char), '__command'], [Pointer(T.char), '__modes']]))('popen');},
    pclose: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']]))('pclose');},
    ctermid: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s']]))('ctermid');},
    flockfile: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('flockfile');},
    ftrylockfile: function() {return (Fn(T.i32, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('ftrylockfile');},
    funlockfile: function() {return (Fn(null, [[Pointer(T.FILE), '__stream']], [['nothrow'], ['leaf']]))('funlockfile');},
    __ctype_get_mb_cur_max: function() {return (Fn(T.size_t, [[null]], [['nothrow'], ['leaf']]))('__ctype_get_mb_cur_max');},
    atof: function() {return (Fn(T.f64, [[Pointer(T.char), '__nptr']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('atof');},
    atoi: function() {return (Fn(T.i32, [[Pointer(T.char), '__nptr']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('atoi');},
    atol: function() {return (Fn(T.i32, [[Pointer(T.char), '__nptr']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('atol');},
    atoll: function() {return (Fn(T.i64, [[Pointer(T.char), '__nptr']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('atoll');},
    strtod: function() {return (Fn(T.f64, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtod');},
    strtof: function() {return (Fn(T.f32, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtof');},
    strtold: function() {return (Fn(T.f128, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtold');},
    strtol: function() {return (Fn(T.i32, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtol');},
    strtoul: function() {return (Fn(T.u32, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtoul');},
    strtoq: function() {return (Fn(T.i64, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtoq');},
    strtouq: function() {return (Fn(T.u64, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtouq');},
    strtoll: function() {return (Fn(T.i64, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtoll');},
    strtoull: function() {return (Fn(T.u64, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strtoull');},
    l64a: function() {return (Fn(Pointer(T.char), [[T.i32, '__n']]))('l64a');},
    a64l: function() {return (Fn(T.i32, [[Pointer(T.char), '__s']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('a64l');},
    select: function() {return (Fn(T.i32, [[T.i32, '__nfds'], [Pointer(T.fd_set), '__readfds'], [Pointer(T.fd_set), '__writefds'], [Pointer(T.fd_set), '__exceptfds'], [Pointer(Struct('timeval', null)), '__timeout']]))('select');},
    pselect: function() {return (Fn(T.i32, [[T.i32, '__nfds'], [Pointer(T.fd_set), '__readfds'], [Pointer(T.fd_set), '__writefds'], [Pointer(T.fd_set), '__exceptfds'], [Pointer(Struct('timespec', null)), '__timeout'], [Pointer(T.__sigset_t), '__sigmask']]))('pselect');},
    gnu_dev_major: function() {return (Fn(T.u32, [[T.u64, '__dev']], [['nothrow'], ['leaf'], ['const']]))('gnu_dev_major');},
    gnu_dev_minor: function() {return (Fn(T.u32, [[T.u64, '__dev']], [['nothrow'], ['leaf'], ['const']]))('gnu_dev_minor');},
    gnu_dev_makedev: function() {return (Fn(T.u64, [[T.u32, '__major'], [T.u32, '__minor']], [['nothrow'], ['leaf'], ['const']]))('gnu_dev_makedev');},
    random: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('random');},
    srandom: function() {return (Fn(null, [[T.u32, '__seed']], [['nothrow'], ['leaf']]))('srandom');},
    initstate: function() {return (Fn(Pointer(T.char), [[T.u32, '__seed'], [Pointer(T.char), '__statebuf'], [T.size_t, '__statelen']]))('initstate');},
    setstate: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__statebuf']]))('setstate');},
    random_r: function() {return (Fn(T.i32, [[Pointer(Struct('random_data', null)), '__buf'], [Pointer(T.int32_t), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('random_r');},
    srandom_r: function() {return (Fn(T.i32, [[T.u32, '__seed'], [Pointer(Struct('random_data', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('srandom_r');},
    initstate_r: function() {return (Fn(T.i32, [[T.u32, '__seed'], [Pointer(T.char), '__statebuf'], [T.size_t, '__statelen'], [Pointer(Struct('random_data', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"4"}]]))('initstate_r');},
    setstate_r: function() {return (Fn(T.i32, [[Pointer(T.char), '__statebuf'], [Pointer(Struct('random_data', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('setstate_r');},
    rand: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('rand');},
    srand: function() {return (Fn(null, [[T.u32, '__seed']], [['nothrow'], ['leaf']]))('srand');},
    rand_r: function() {return (Fn(T.i32, [[Pointer(T.u32), '__seed']], [['nothrow'], ['leaf']]))('rand_r');},
    drand48: function() {return (Fn(T.f64, [[null]], [['nothrow'], ['leaf']]))('drand48');},
    erand48: function() {return (Fn(T.f64, [[ArrayType(T.u16, 3), '__xsubi']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('erand48');},
    lrand48: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('lrand48');},
    nrand48: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__xsubi']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('nrand48');},
    mrand48: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('mrand48');},
    jrand48: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__xsubi']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('jrand48');},
    srand48: function() {return (Fn(null, [[T.i32, '__seedval']], [['nothrow'], ['leaf']]))('srand48');},
    seed48: function() {return (Fn(Pointer(T.u16), [[ArrayType(T.u16, 3), '__seed16v']]))('seed48');},
    lcong48: function() {return (Fn(null, [[ArrayType(T.u16, 7), '__param']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('lcong48');},
    drand48_r: function() {return (Fn(T.i32, [[Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.f64), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('drand48_r');},
    erand48_r: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__xsubi'], [Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.f64), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('erand48_r');},
    lrand48_r: function() {return (Fn(T.i32, [[Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.i32), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('lrand48_r');},
    nrand48_r: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__xsubi'], [Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.i32), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('nrand48_r');},
    mrand48_r: function() {return (Fn(T.i32, [[Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.i32), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('mrand48_r');},
    jrand48_r: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__xsubi'], [Pointer(Struct('drand48_data', null)), '__buffer'], [Pointer(T.i32), '__result']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('jrand48_r');},
    srand48_r: function() {return (Fn(T.i32, [[T.i32, '__seedval'], [Pointer(Struct('drand48_data', null)), '__buffer']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('srand48_r');},
    seed48_r: function() {return (Fn(T.i32, [[ArrayType(T.u16, 3), '__seed16v'], [Pointer(Struct('drand48_data', null)), '__buffer']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('seed48_r');},
    lcong48_r: function() {return (Fn(T.i32, [[ArrayType(T.u16, 7), '__param'], [Pointer(Struct('drand48_data', null)), '__buffer']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('lcong48_r');},
    malloc: function() {return (Fn(Pointer(null), [[T.size_t, '__size']]))('malloc');},
    calloc: function() {return (Fn(Pointer(null), [[T.size_t, '__nmemb'], [T.size_t, '__size']]))('calloc');},
    realloc: function() {return (Fn(Pointer(null), [[Pointer(null), '__ptr'], [T.size_t, '__size']]))('realloc');},
    free: function() {return (Fn(null, [[Pointer(null), '__ptr']], [['nothrow'], ['leaf']]))('free');},
    cfree: function() {return (Fn(null, [[Pointer(null), '__ptr']], [['nothrow'], ['leaf']]))('cfree');},
    alloca: function() {return (Fn(Pointer(null), [[T.size_t, '__size']]))('alloca');},
    valloc: function() {return (Fn(Pointer(null), [[T.size_t, '__size']]))('valloc');},
    posix_memalign: function() {return (Fn(T.i32, [[Pointer(Pointer(null)), '__memptr'], [T.size_t, '__alignment'], [T.size_t, '__size']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('posix_memalign');},
    abort: function() {return (Fn(null, [[null]], [['nothrow'], ['leaf'], ['noreturn']]))('abort');},
    atexit: function() {return (Fn(T.i32, [[Pointer(Fn(null, [[null]])), '__func']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('atexit');},
    on_exit: function() {return (Fn(T.i32, [[Pointer(Fn(null, [[T.i32, '__status'], [Pointer(null), '__arg']])), '__func'], [Pointer(null), '__arg']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('on_exit');},
    exit: function() {return (Fn(null, [[T.i32, '__status']], [['nothrow'], ['leaf'], ['noreturn']]))('exit');},
    _Exit: function() {return (Fn(null, [[T.i32, '__status']], [['nothrow'], ['leaf'], ['noreturn']]))('_Exit');},
    getenv: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__name']]))('getenv');},
    putenv: function() {return (Fn(T.i32, [[Pointer(T.char), '__string']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('putenv');},
    setenv: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [Pointer(T.char), '__value'], [T.i32, '__replace']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('setenv');},
    unsetenv: function() {return (Fn(T.i32, [[Pointer(T.char), '__name']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('unsetenv');},
    clearenv: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('clearenv');},
    mktemp: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__template']]))('mktemp');},
    mkstemp: function() {return (Fn(T.i32, [[Pointer(T.char), '__template']], [['nonnull', {"__rule":"constant","_0":"1"}]]))('mkstemp');},
    mkstemps: function() {return (Fn(T.i32, [[Pointer(T.char), '__template'], [T.i32, '__suffixlen']], [['nonnull', {"__rule":"constant","_0":"1"}]]))('mkstemps');},
    mkdtemp: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__template']]))('mkdtemp');},
    system: function() {return (Fn(T.i32, [[Pointer(T.char), '__command']]))('system');},
    realpath: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__name'], [Pointer(T.char), '__resolved']]))('realpath');},
    bsearch: function() {return (Fn(Pointer(null), [[Pointer(null), '__key'], [Pointer(null), '__base'], [T.size_t, '__nmemb'], [T.size_t, '__size'], [T.__compar_fn_t, '__compar']]))('bsearch');},
    qsort: function() {return (Fn(null, [[Pointer(null), '__base'], [T.size_t, '__nmemb'], [T.size_t, '__size'], [T.__compar_fn_t, '__compar']], [['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"4"}]]))('qsort');},
    abs: function() {return (Fn(T.i32, [[T.i32, '__x']], [['nothrow'], ['leaf'], ['const']]))('abs');},
    labs: function() {return (Fn(T.i32, [[T.i32, '__x']], [['nothrow'], ['leaf'], ['const']]))('labs');},
    llabs: function() {return (Fn(T.i64, [[T.i64, '__x']], [['nothrow'], ['leaf'], ['const']]))('llabs');},
    div: function() {return (Fn(T.div_t, [[T.i32, '__numer'], [T.i32, '__denom']], [['nothrow'], ['leaf'], ['const']]))('div');},
    ldiv: function() {return (Fn(T.ldiv_t, [[T.i32, '__numer'], [T.i32, '__denom']], [['nothrow'], ['leaf'], ['const']]))('ldiv');},
    lldiv: function() {return (Fn(T.lldiv_t, [[T.i64, '__numer'], [T.i64, '__denom']], [['nothrow'], ['leaf'], ['const']]))('lldiv');},
    ecvt: function() {return (Fn(Pointer(T.char), [[T.f64, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign']]))('ecvt');},
    fcvt: function() {return (Fn(Pointer(T.char), [[T.f64, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign']]))('fcvt');},
    gcvt: function() {return (Fn(Pointer(T.char), [[T.f64, '__value'], [T.i32, '__ndigit'], [Pointer(T.char), '__buf']]))('gcvt');},
    qecvt: function() {return (Fn(Pointer(T.char), [[T.f128, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign']]))('qecvt');},
    qfcvt: function() {return (Fn(Pointer(T.char), [[T.f128, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign']]))('qfcvt');},
    qgcvt: function() {return (Fn(Pointer(T.char), [[T.f128, '__value'], [T.i32, '__ndigit'], [Pointer(T.char), '__buf']]))('qgcvt');},
    ecvt_r: function() {return (Fn(T.i32, [[T.f64, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}, {"__rule":"constant","_0":"5"}]]))('ecvt_r');},
    fcvt_r: function() {return (Fn(T.i32, [[T.f64, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}, {"__rule":"constant","_0":"5"}]]))('fcvt_r');},
    qecvt_r: function() {return (Fn(T.i32, [[T.f128, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}, {"__rule":"constant","_0":"5"}]]))('qecvt_r');},
    qfcvt_r: function() {return (Fn(T.i32, [[T.f128, '__value'], [T.i32, '__ndigit'], [Pointer(T.i32), '__decpt'], [Pointer(T.i32), '__sign'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}, {"__rule":"constant","_0":"5"}]]))('qfcvt_r');},
    mblen: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('mblen');},
    mbtowc: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__pwc'], [Pointer(T.char), '__s'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('mbtowc');},
    wctomb: function() {return (Fn(T.i32, [[Pointer(T.char), '__s'], [T.wchar_t, '__wchar']], [['nothrow'], ['leaf']]))('wctomb');},
    mbstowcs: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__pwcs'], [Pointer(T.char), '__s'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('mbstowcs');},
    wcstombs: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [Pointer(T.wchar_t), '__pwcs'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('wcstombs');},
    rpmatch: function() {return (Fn(T.i32, [[Pointer(T.char), '__response']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('rpmatch');},
    getsubopt: function() {return (Fn(T.i32, [[Pointer(Pointer(T.char)), '__optionp'], [Pointer(Pointer(T.char)), '__tokens'], [Pointer(Pointer(T.char)), '__valuep']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('getsubopt');},
    getloadavg: function() {return (Fn(T.i32, [[Pointer(T.f64), '__loadavg'], [T.i32, '__nelem']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('getloadavg');},
    memcpy: function() {return (Fn(Pointer(null), [[Pointer(null), '__dest'], [Pointer(null), '__src'], [T.size_t, '__n']]))('memcpy');},
    memmove: function() {return (Fn(Pointer(null), [[Pointer(null), '__dest'], [Pointer(null), '__src'], [T.size_t, '__n']]))('memmove');},
    memccpy: function() {return (Fn(Pointer(null), [[Pointer(null), '__dest'], [Pointer(null), '__src'], [T.i32, '__c'], [T.size_t, '__n']]))('memccpy');},
    memset: function() {return (Fn(Pointer(null), [[Pointer(null), '__s'], [T.i32, '__c'], [T.size_t, '__n']]))('memset');},
    memcmp: function() {return (Fn(T.i32, [[Pointer(null), '__s1'], [Pointer(null), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('memcmp');},
    memchr: function() {return (Fn(Pointer(null), [[Pointer(null), '__s'], [T.i32, '__c'], [T.size_t, '__n']]))('memchr');},
    strcpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src']]))('strcpy');},
    strncpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n']]))('strncpy');},
    strcat: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src']]))('strcat');},
    strncat: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n']]))('strncat');},
    strcmp: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strcmp');},
    strncmp: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strncmp');},
    strcoll: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strcoll');},
    strxfrm: function() {return (Fn(T.size_t, [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('strxfrm');},
    strcoll_l: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2'], [T.__locale_t, '__l']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('strcoll_l');},
    strxfrm_l: function() {return (Fn(T.size_t, [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n'], [T.__locale_t, '__l']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"4"}]]))('strxfrm_l');},
    strdup: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s']]))('strdup');},
    strndup: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__string'], [T.size_t, '__n']]))('strndup');},
    strchr: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [T.i32, '__c']]))('strchr');},
    strrchr: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [T.i32, '__c']]))('strrchr');},
    strcspn: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [Pointer(T.char), '__reject']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strcspn');},
    strspn: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [Pointer(T.char), '__accept']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strspn');},
    strpbrk: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [Pointer(T.char), '__accept']]))('strpbrk');},
    strstr: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__haystack'], [Pointer(T.char), '__needle']]))('strstr');},
    strtok: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [Pointer(T.char), '__delim']]))('strtok');},
    __strtok_r: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [Pointer(T.char), '__delim'], [Pointer(Pointer(T.char)), '__save_ptr']]))('__strtok_r');},
    strtok_r: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [Pointer(T.char), '__delim'], [Pointer(Pointer(T.char)), '__save_ptr']]))('strtok_r');},
    strlen: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strlen');},
    strnlen: function() {return (Fn(T.size_t, [[Pointer(T.char), '__string'], [T.size_t, '__maxlen']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('strnlen');},
    strerror: function() {return (Fn(Pointer(T.char), [[T.i32, '__errnum']]))('strerror');},
    strerror_r: function() {return (Fn(T.i32, [[T.i32, '__errnum'], [Pointer(T.char), '__buf'], [T.size_t, '__buflen']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('strerror_r');},
    strerror_l: function() {return (Fn(Pointer(T.char), [[T.i32, '__errnum'], [T.__locale_t, '__l']]))('strerror_l');},
    __bzero: function() {return (Fn(null, [[Pointer(null), '__s'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('__bzero');},
    bcopy: function() {return (Fn(null, [[Pointer(null), '__src'], [Pointer(null), '__dest'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('bcopy');},
    bzero: function() {return (Fn(null, [[Pointer(null), '__s'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('bzero');},
    bcmp: function() {return (Fn(T.i32, [[Pointer(null), '__s1'], [Pointer(null), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('bcmp');},
    index: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [T.i32, '__c']]))('index');},
    rindex: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__s'], [T.i32, '__c']]))('rindex');},
    ffs: function() {return (Fn(T.i32, [[T.i32, '__i']], [['nothrow'], ['leaf'], ['const']]))('ffs');},
    strcasecmp: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strcasecmp');},
    strncasecmp: function() {return (Fn(T.i32, [[Pointer(T.char), '__s1'], [Pointer(T.char), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('strncasecmp');},
    strsep: function() {return (Fn(Pointer(T.char), [[Pointer(Pointer(T.char)), '__stringp'], [Pointer(T.char), '__delim']]))('strsep');},
    strsignal: function() {return (Fn(Pointer(T.char), [[T.i32, '__sig']]))('strsignal');},
    __stpcpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src']]))('__stpcpy');},
    stpcpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src']]))('stpcpy');},
    __stpncpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n']]))('__stpncpy');},
    stpncpy: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__dest'], [Pointer(T.char), '__src'], [T.size_t, '__n']]))('stpncpy');},
    access: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.i32, '__type']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('access');},
    faccessat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__file'], [T.i32, '__type'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('faccessat');},
    lseek: function() {return (Fn(T.__off_t, [[T.i32, '__fd'], [T.__off_t, '__offset'], [T.i32, '__whence']], [['nothrow'], ['leaf']]))('lseek');},
    close: function() {return (Fn(T.i32, [[T.i32, '__fd']]))('close');},
    read: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__nbytes']]))('read');},
    write: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n']]))('write');},
    pread: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__nbytes'], [T.__off_t, '__offset']]))('pread');},
    pwrite: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n'], [T.__off_t, '__offset']]))('pwrite');},
    pipe: function() {return (Fn(T.i32, [[ArrayType(T.i32, 2), '__pipedes']], [['nothrow'], ['leaf']]))('pipe');},
    alarm: function() {return (Fn(T.u32, [[T.u32, '__seconds']], [['nothrow'], ['leaf']]))('alarm');},
    sleep: function() {return (Fn(T.u32, [[T.u32, '__seconds']]))('sleep');},
    ualarm: function() {return (Fn(T.__useconds_t, [[T.__useconds_t, '__value'], [T.__useconds_t, '__interval']], [['nothrow'], ['leaf']]))('ualarm');},
    usleep: function() {return (Fn(T.i32, [[T.__useconds_t, '__useconds']]))('usleep');},
    pause: function() {return (Fn(T.i32, [[null]]))('pause');},
    chown: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.__uid_t, '__owner'], [T.__gid_t, '__group']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('chown');},
    fchown: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.__uid_t, '__owner'], [T.__gid_t, '__group']], [['nothrow'], ['leaf']]))('fchown');},
    lchown: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.__uid_t, '__owner'], [T.__gid_t, '__group']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('lchown');},
    fchownat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__file'], [T.__uid_t, '__owner'], [T.__gid_t, '__group'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('fchownat');},
    chdir: function() {return (Fn(T.i32, [[Pointer(T.char), '__path']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('chdir');},
    fchdir: function() {return (Fn(T.i32, [[T.i32, '__fd']], [['nothrow'], ['leaf']]))('fchdir');},
    getcwd: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__buf'], [T.size_t, '__size']]))('getcwd');},
    getwd: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__buf']]))('getwd');},
    dup: function() {return (Fn(T.i32, [[T.i32, '__fd']], [['nothrow'], ['leaf']]))('dup');},
    dup2: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__fd2']], [['nothrow'], ['leaf']]))('dup2');},
    __environ: function() {return (Pointer(Pointer(T.char)))('__environ');},
    execve: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [Pointer(Pointer(T.char)), '__argv'], [Pointer(Pointer(T.char)), '__envp']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execve');},
    fexecve: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Pointer(T.char)), '__argv'], [Pointer(Pointer(T.char)), '__envp']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('fexecve');},
    execv: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [Pointer(Pointer(T.char)), '__argv']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execv');},
    execle: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [Pointer(T.char), '__arg'], '...'], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execle');},
    execl: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [Pointer(T.char), '__arg'], '...'], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execl');},
    execvp: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [Pointer(Pointer(T.char)), '__argv']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execvp');},
    execlp: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [Pointer(T.char), '__arg'], '...'], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('execlp');},
    nice: function() {return (Fn(T.i32, [[T.i32, '__inc']], [['nothrow'], ['leaf']]))('nice');},
    _exit: function() {return (Fn(null, [[T.i32, '__status']], [['noreturn']]))('_exit');},
    pathconf: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [T.i32, '__name']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('pathconf');},
    fpathconf: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__name']], [['nothrow'], ['leaf']]))('fpathconf');},
    sysconf: function() {return (Fn(T.i32, [[T.i32, '__name']], [['nothrow'], ['leaf']]))('sysconf');},
    confstr: function() {return (Fn(T.size_t, [[T.i32, '__name'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf']]))('confstr');},
    getpid: function() {return (Fn(T.__pid_t, [[null]], [['nothrow'], ['leaf']]))('getpid');},
    getppid: function() {return (Fn(T.__pid_t, [[null]], [['nothrow'], ['leaf']]))('getppid');},
    getpgrp: function() {return (Fn(T.__pid_t, [[null]], [['nothrow'], ['leaf']]))('getpgrp');},
    __getpgid: function() {return (Fn(T.__pid_t, [[T.__pid_t, '__pid']], [['nothrow'], ['leaf']]))('__getpgid');},
    getpgid: function() {return (Fn(T.__pid_t, [[T.__pid_t, '__pid']], [['nothrow'], ['leaf']]))('getpgid');},
    setpgid: function() {return (Fn(T.i32, [[T.__pid_t, '__pid'], [T.__pid_t, '__pgid']], [['nothrow'], ['leaf']]))('setpgid');},
    setpgrp: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('setpgrp');},
    setsid: function() {return (Fn(T.__pid_t, [[null]], [['nothrow'], ['leaf']]))('setsid');},
    getsid: function() {return (Fn(T.__pid_t, [[T.__pid_t, '__pid']], [['nothrow'], ['leaf']]))('getsid');},
    getuid: function() {return (Fn(T.__uid_t, [[null]], [['nothrow'], ['leaf']]))('getuid');},
    geteuid: function() {return (Fn(T.__uid_t, [[null]], [['nothrow'], ['leaf']]))('geteuid');},
    getgid: function() {return (Fn(T.__gid_t, [[null]], [['nothrow'], ['leaf']]))('getgid');},
    getegid: function() {return (Fn(T.__gid_t, [[null]], [['nothrow'], ['leaf']]))('getegid');},
    getgroups: function() {return (Fn(T.i32, [[T.i32, '__size'], [Pointer(T.__gid_t), '__list']], [['nothrow'], ['leaf']]))('getgroups');},
    setuid: function() {return (Fn(T.i32, [[T.__uid_t, '__uid']], [['nothrow'], ['leaf']]))('setuid');},
    setreuid: function() {return (Fn(T.i32, [[T.__uid_t, '__ruid'], [T.__uid_t, '__euid']], [['nothrow'], ['leaf']]))('setreuid');},
    seteuid: function() {return (Fn(T.i32, [[T.__uid_t, '__uid']], [['nothrow'], ['leaf']]))('seteuid');},
    setgid: function() {return (Fn(T.i32, [[T.__gid_t, '__gid']], [['nothrow'], ['leaf']]))('setgid');},
    setregid: function() {return (Fn(T.i32, [[T.__gid_t, '__rgid'], [T.__gid_t, '__egid']], [['nothrow'], ['leaf']]))('setregid');},
    setegid: function() {return (Fn(T.i32, [[T.__gid_t, '__gid']], [['nothrow'], ['leaf']]))('setegid');},
    fork: function() {return (Fn(T.__pid_t, [[null]], [['nothrow']]))('fork');},
    vfork: function() {return (Fn(T.__pid_t, [[null]], [['nothrow'], ['leaf']]))('vfork');},
    ttyname: function() {return (Fn(Pointer(T.char), [[T.i32, '__fd']]))('ttyname');},
    ttyname_r: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__buf'], [T.size_t, '__buflen']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('ttyname_r');},
    isatty: function() {return (Fn(T.i32, [[T.i32, '__fd']], [['nothrow'], ['leaf']]))('isatty');},
    ttyslot: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('ttyslot');},
    link: function() {return (Fn(T.i32, [[Pointer(T.char), '__from'], [Pointer(T.char), '__to']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('link');},
    linkat: function() {return (Fn(T.i32, [[T.i32, '__fromfd'], [Pointer(T.char), '__from'], [T.i32, '__tofd'], [Pointer(T.char), '__to'], [T.i32, '__flags']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"4"}]]))('linkat');},
    symlink: function() {return (Fn(T.i32, [[Pointer(T.char), '__from'], [Pointer(T.char), '__to']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('symlink');},
    readlink: function() {return (Fn(T.ssize_t, [[Pointer(T.char), '__path'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('readlink');},
    symlinkat: function() {return (Fn(T.i32, [[Pointer(T.char), '__from'], [T.i32, '__tofd'], [Pointer(T.char), '__to']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"3"}]]))('symlinkat');},
    readlinkat: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(T.char), '__path'], [Pointer(T.char), '__buf'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('readlinkat');},
    unlink: function() {return (Fn(T.i32, [[Pointer(T.char), '__name']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('unlink');},
    unlinkat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__name'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('unlinkat');},
    rmdir: function() {return (Fn(T.i32, [[Pointer(T.char), '__path']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('rmdir');},
    tcgetpgrp: function() {return (Fn(T.__pid_t, [[T.i32, '__fd']], [['nothrow'], ['leaf']]))('tcgetpgrp');},
    tcsetpgrp: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.__pid_t, '__pgrp_id']], [['nothrow'], ['leaf']]))('tcsetpgrp');},
    getlogin: function() {return (Fn(Pointer(T.char), [[null]]))('getlogin');},
    getlogin_r: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.size_t, '__name_len']], [['nonnull', {"__rule":"constant","_0":"1"}]]))('getlogin_r');},
    setlogin: function() {return (Fn(T.i32, [[Pointer(T.char), '__name']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('setlogin');},
    optarg: function() {return (Pointer(T.char))('optarg');},
    optind: function() {return (T.i32)('optind');},
    opterr: function() {return (T.i32)('opterr');},
    optopt: function() {return (T.i32)('optopt');},
    getopt: function() {return (Fn(T.i32, [[T.i32, '___argc'], [Pointer(Pointer(T.char)), '___argv'], [Pointer(T.char), '__shortopts']], [['nothrow'], ['leaf']]))('getopt');},
    gethostname: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('gethostname');},
    sethostname: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('sethostname');},
    sethostid: function() {return (Fn(T.i32, [[T.i32, '__id']], [['nothrow'], ['leaf']]))('sethostid');},
    getdomainname: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('getdomainname');},
    setdomainname: function() {return (Fn(T.i32, [[Pointer(T.char), '__name'], [T.size_t, '__len']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('setdomainname');},
    vhangup: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('vhangup');},
    revoke: function() {return (Fn(T.i32, [[Pointer(T.char), '__file']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('revoke');},
    profil: function() {return (Fn(T.i32, [[Pointer(T.u16), '__sample_buffer'], [T.size_t, '__size'], [T.size_t, '__offset'], [T.u32, '__scale']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('profil');},
    acct: function() {return (Fn(T.i32, [[Pointer(T.char), '__name']], [['nothrow'], ['leaf']]))('acct');},
    getusershell: function() {return (Fn(Pointer(T.char), [[null]]))('getusershell');},
    endusershell: function() {return (Fn(null, [[null]], [['nothrow'], ['leaf']]))('endusershell');},
    setusershell: function() {return (Fn(null, [[null]], [['nothrow'], ['leaf']]))('setusershell');},
    daemon: function() {return (Fn(T.i32, [[T.i32, '__nochdir'], [T.i32, '__noclose']], [['nothrow'], ['leaf']]))('daemon');},
    chroot: function() {return (Fn(T.i32, [[Pointer(T.char), '__path']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('chroot');},
    getpass: function() {return (Fn(Pointer(T.char), [[Pointer(T.char), '__prompt']]))('getpass');},
    fsync: function() {return (Fn(T.i32, [[T.i32, '__fd']]))('fsync');},
    gethostid: function() {return (Fn(T.i32, [[null]]))('gethostid');},
    sync: function() {return (Fn(null, [[null]], [['nothrow'], ['leaf']]))('sync');},
    getpagesize: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf'], ['const']]))('getpagesize');},
    getdtablesize: function() {return (Fn(T.i32, [[null]], [['nothrow'], ['leaf']]))('getdtablesize');},
    truncate: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.__off_t, '__length']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('truncate');},
    ftruncate: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.__off_t, '__length']], [['nothrow'], ['leaf']]))('ftruncate');},
    brk: function() {return (Fn(T.i32, [[Pointer(null), '__addr']], [['nothrow'], ['leaf']]))('brk');},
    sbrk: function() {return (Fn(Pointer(null), [[T.intptr_t, '__delta']]))('sbrk');},
    syscall: function() {return (Fn(T.i32, [[T.i32, '__sysno'], '...'], [['nothrow'], ['leaf']]))('syscall');},
    fdatasync: function() {return (Fn(T.i32, [[T.i32, '__fildes']]))('fdatasync');},
    wcscpy: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src']]))('wcscpy');},
    wcsncpy: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src'], [T.size_t, '__n']]))('wcsncpy');},
    wcscat: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src']]))('wcscat');},
    wcsncat: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src'], [T.size_t, '__n']]))('wcsncat');},
    wcscmp: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2']], [['nothrow'], ['leaf'], ['pure']]))('wcscmp');},
    wcsncmp: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure']]))('wcsncmp');},
    wcscasecmp: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2']], [['nothrow'], ['leaf']]))('wcscasecmp');},
    wcsncasecmp: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('wcsncasecmp');},
    wcscasecmp_l: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.__locale_t, '__loc']], [['nothrow'], ['leaf']]))('wcscasecmp_l');},
    wcsncasecmp_l: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n'], [T.__locale_t, '__loc']], [['nothrow'], ['leaf']]))('wcsncasecmp_l');},
    wcscoll: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2']], [['nothrow'], ['leaf']]))('wcscoll');},
    wcsxfrm: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf']]))('wcsxfrm');},
    wcscoll_l: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.__locale_t, '__loc']], [['nothrow'], ['leaf']]))('wcscoll_l');},
    wcsxfrm_l: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n'], [T.__locale_t, '__loc']], [['nothrow'], ['leaf']]))('wcsxfrm_l');},
    wcsdup: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s']]))('wcsdup');},
    wcschr: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__wcs'], [T.wchar_t, '__wc']]))('wcschr');},
    wcsrchr: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__wcs'], [T.wchar_t, '__wc']]))('wcsrchr');},
    wcscspn: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__wcs'], [Pointer(T.wchar_t), '__reject']], [['nothrow'], ['leaf'], ['pure']]))('wcscspn');},
    wcsspn: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__wcs'], [Pointer(T.wchar_t), '__accept']], [['nothrow'], ['leaf'], ['pure']]))('wcsspn');},
    wcspbrk: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__wcs'], [Pointer(T.wchar_t), '__accept']]))('wcspbrk');},
    wcsstr: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__haystack'], [Pointer(T.wchar_t), '__needle']]))('wcsstr');},
    wcstok: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s'], [Pointer(T.wchar_t), '__delim'], [Pointer(Pointer(T.wchar_t)), '__ptr']]))('wcstok');},
    wcslen: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__s']], [['nothrow'], ['leaf'], ['pure']]))('wcslen');},
    wcsnlen: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__s'], [T.size_t, '__maxlen']], [['nothrow'], ['leaf'], ['pure']]))('wcsnlen');},
    wmemchr: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s'], [T.wchar_t, '__c'], [T.size_t, '__n']]))('wmemchr');},
    wmemcmp: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']], [['nothrow'], ['leaf'], ['pure']]))('wmemcmp');},
    wmemcpy: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']]))('wmemcpy');},
    wmemmove: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s1'], [Pointer(T.wchar_t), '__s2'], [T.size_t, '__n']]))('wmemmove');},
    wmemset: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__s'], [T.wchar_t, '__c'], [T.size_t, '__n']]))('wmemset');},
    btowc: function() {return (Fn(T.wint_t, [[T.i32, '__c']], [['nothrow'], ['leaf']]))('btowc');},
    wctob: function() {return (Fn(T.i32, [[T.wint_t, '__c']], [['nothrow'], ['leaf']]))('wctob');},
    mbsinit: function() {return (Fn(T.i32, [[Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf'], ['pure']]))('mbsinit');},
    mbrtowc: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__pwc'], [Pointer(T.char), '__s'], [T.size_t, '__n'], [Pointer(T.mbstate_t), '__p']], [['nothrow'], ['leaf']]))('mbrtowc');},
    wcrtomb: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [T.wchar_t, '__wc'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('wcrtomb');},
    __mbrlen: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [T.size_t, '__n'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('__mbrlen');},
    mbrlen: function() {return (Fn(T.size_t, [[Pointer(T.char), '__s'], [T.size_t, '__n'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('mbrlen');},
    mbsrtowcs: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__dst'], [Pointer(Pointer(T.char)), '__src'], [T.size_t, '__len'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('mbsrtowcs');},
    wcsrtombs: function() {return (Fn(T.size_t, [[Pointer(T.char), '__dst'], [Pointer(Pointer(T.wchar_t)), '__src'], [T.size_t, '__len'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('wcsrtombs');},
    mbsnrtowcs: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__dst'], [Pointer(Pointer(T.char)), '__src'], [T.size_t, '__nmc'], [T.size_t, '__len'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('mbsnrtowcs');},
    wcsnrtombs: function() {return (Fn(T.size_t, [[Pointer(T.char), '__dst'], [Pointer(Pointer(T.wchar_t)), '__src'], [T.size_t, '__nwc'], [T.size_t, '__len'], [Pointer(T.mbstate_t), '__ps']], [['nothrow'], ['leaf']]))('wcsnrtombs');},
    wcstod: function() {return (Fn(T.f64, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr']], [['nothrow'], ['leaf']]))('wcstod');},
    wcstof: function() {return (Fn(T.f32, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr']], [['nothrow'], ['leaf']]))('wcstof');},
    wcstold: function() {return (Fn(T.f128, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr']], [['nothrow'], ['leaf']]))('wcstold');},
    wcstol: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstol');},
    wcstoul: function() {return (Fn(T.u32, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstoul');},
    wcstoll: function() {return (Fn(T.i64, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstoll');},
    wcstoull: function() {return (Fn(T.u64, [[Pointer(T.wchar_t), '__nptr'], [Pointer(Pointer(T.wchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstoull');},
    wcpcpy: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src']]))('wcpcpy');},
    wcpncpy: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__dest'], [Pointer(T.wchar_t), '__src'], [T.size_t, '__n']]))('wcpncpy');},
    open_wmemstream: function() {return (Fn(Pointer(T.__FILE), [[Pointer(Pointer(T.wchar_t)), '__bufloc'], [Pointer(T.size_t), '__sizeloc']]))('open_wmemstream');},
    fwide: function() {return (Fn(T.i32, [[Pointer(T.__FILE), '__fp'], [T.i32, '__mode']], [['nothrow'], ['leaf']]))('fwide');},
    fwprintf: function() {return (Fn(T.i32, [[Pointer(T.__FILE), '__stream'], [Pointer(T.wchar_t), '__format'], '...']))('fwprintf');},
    wprintf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__format'], '...']))('wprintf');},
    swprintf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s'], [T.size_t, '__n'], [Pointer(T.wchar_t), '__format'], '...'], [['nothrow'], ['leaf']]))('swprintf');},
    vfwprintf: function() {return (Fn(T.i32, [[Pointer(T.__FILE), '__s'], [Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']]))('vfwprintf');},
    vwprintf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']]))('vwprintf');},
    vswprintf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s'], [T.size_t, '__n'], [Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']], [['nothrow'], ['leaf']]))('vswprintf');},
    fwscanf: function() {return (Fn(T.i32, [[Pointer(T.__FILE), '__stream'], [Pointer(T.wchar_t), '__format'], '...']))('fwscanf');},
    wscanf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__format'], '...']))('wscanf');},
    swscanf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s'], [Pointer(T.wchar_t), '__format'], '...'], [['nothrow'], ['leaf']]))('swscanf');},
    vfwscanf: function() {return (Fn(T.i32, [[Pointer(T.__FILE), '__s'], [Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']]))('vfwscanf');},
    vwscanf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']]))('vwscanf');},
    vswscanf: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__s'], [Pointer(T.wchar_t), '__format'], [T.__gnuc_va_list, '__arg']], [['nothrow'], ['leaf']]))('vswscanf');},
    fgetwc: function() {return (Fn(T.wint_t, [[Pointer(T.__FILE), '__stream']]))('fgetwc');},
    getwc: function() {return (Fn(T.wint_t, [[Pointer(T.__FILE), '__stream']]))('getwc');},
    getwchar: function() {return (Fn(T.wint_t, [[null]]))('getwchar');},
    fputwc: function() {return (Fn(T.wint_t, [[T.wchar_t, '__wc'], [Pointer(T.__FILE), '__stream']]))('fputwc');},
    putwc: function() {return (Fn(T.wint_t, [[T.wchar_t, '__wc'], [Pointer(T.__FILE), '__stream']]))('putwc');},
    putwchar: function() {return (Fn(T.wint_t, [[T.wchar_t, '__wc']]))('putwchar');},
    fgetws: function() {return (Fn(Pointer(T.wchar_t), [[Pointer(T.wchar_t), '__ws'], [T.i32, '__n'], [Pointer(T.__FILE), '__stream']]))('fgetws');},
    fputws: function() {return (Fn(T.i32, [[Pointer(T.wchar_t), '__ws'], [Pointer(T.__FILE), '__stream']]))('fputws');},
    ungetwc: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc'], [Pointer(T.__FILE), '__stream']]))('ungetwc');},
    wcsftime: function() {return (Fn(T.size_t, [[Pointer(T.wchar_t), '__s'], [T.size_t, '__maxsize'], [Pointer(T.wchar_t), '__format'], [Pointer(Struct('tm', null)), '__tp']], [['nothrow'], ['leaf']]))('wcsftime');},
    iswalnum: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswalnum');},
    iswalpha: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswalpha');},
    iswcntrl: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswcntrl');},
    iswdigit: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswdigit');},
    iswgraph: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswgraph');},
    iswlower: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswlower');},
    iswprint: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswprint');},
    iswpunct: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswpunct');},
    iswspace: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswspace');},
    iswupper: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswupper');},
    iswxdigit: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswxdigit');},
    iswblank: function() {return (Fn(T.i32, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('iswblank');},
    wctype: function() {return (Fn(T.wctype_t, [[Pointer(T.char), '__property']], [['nothrow'], ['leaf']]))('wctype');},
    iswctype: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.wctype_t, '__desc']], [['nothrow'], ['leaf']]))('iswctype');},
    towlower: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('towlower');},
    towupper: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc']], [['nothrow'], ['leaf']]))('towupper');},
    wctrans: function() {return (Fn(T.wctrans_t, [[Pointer(T.char), '__property']], [['nothrow'], ['leaf']]))('wctrans');},
    towctrans: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc'], [T.wctrans_t, '__desc']], [['nothrow'], ['leaf']]))('towctrans');},
    iswalnum_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswalnum_l');},
    iswalpha_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswalpha_l');},
    iswcntrl_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswcntrl_l');},
    iswdigit_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswdigit_l');},
    iswgraph_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswgraph_l');},
    iswlower_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswlower_l');},
    iswprint_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswprint_l');},
    iswpunct_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswpunct_l');},
    iswspace_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswspace_l');},
    iswupper_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswupper_l');},
    iswxdigit_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswxdigit_l');},
    iswblank_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswblank_l');},
    wctype_l: function() {return (Fn(T.wctype_t, [[Pointer(T.char), '__property'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('wctype_l');},
    iswctype_l: function() {return (Fn(T.i32, [[T.wint_t, '__wc'], [T.wctype_t, '__desc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('iswctype_l');},
    towlower_l: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('towlower_l');},
    towupper_l: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('towupper_l');},
    wctrans_l: function() {return (Fn(T.wctrans_t, [[Pointer(T.char), '__property'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('wctrans_l');},
    towctrans_l: function() {return (Fn(T.wint_t, [[T.wint_t, '__wc'], [T.wctrans_t, '__desc'], [T.__locale_t, '__locale']], [['nothrow'], ['leaf']]))('towctrans_l');},
    poll: function() {return (Fn(T.i32, [[Pointer(Struct('pollfd', null)), '__fds'], [T.nfds_t, '__nfds'], [T.i32, '__timeout']]))('poll');},
    readv: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('iovec', null)), '__iovec'], [T.i32, '__count']]))('readv');},
    writev: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('iovec', null)), '__iovec'], [T.i32, '__count']]))('writev');},
    preadv: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('iovec', null)), '__iovec'], [T.i32, '__count'], [T.__off_t, '__offset']]))('preadv');},
    pwritev: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('iovec', null)), '__iovec'], [T.i32, '__count'], [T.__off_t, '__offset']]))('pwritev');},
    __cmsg_nxthdr: function() {return (Fn(Pointer(Struct('cmsghdr', null)), [[Pointer(Struct('msghdr', null)), '__mhdr'], [Pointer(Struct('cmsghdr', null)), '__cmsg']]))('__cmsg_nxthdr');},
    socket: function() {return (Fn(T.i32, [[T.i32, '__domain'], [T.i32, '__type'], [T.i32, '__protocol']], [['nothrow'], ['leaf']]))('socket');},
    socketpair: function() {return (Fn(T.i32, [[T.i32, '__domain'], [T.i32, '__type'], [T.i32, '__protocol'], [ArrayType(T.i32, 2), '__fds']], [['nothrow'], ['leaf']]))('socketpair');},
    bind: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('sockaddr', null)), '__addr'], [T.socklen_t, '__len']], [['nothrow'], ['leaf']]))('bind');},
    getsockname: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('sockaddr', null)), '__addr'], [Pointer(T.socklen_t), '__len']], [['nothrow'], ['leaf']]))('getsockname');},
    connect: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('sockaddr', null)), '__addr'], [T.socklen_t, '__len']]))('connect');},
    getpeername: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('sockaddr', null)), '__addr'], [Pointer(T.socklen_t), '__len']], [['nothrow'], ['leaf']]))('getpeername');},
    send: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n'], [T.i32, '__flags']]))('send');},
    recv: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n'], [T.i32, '__flags']]))('recv');},
    sendto: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n'], [T.i32, '__flags'], [Pointer(Struct('sockaddr', null)), '__addr'], [T.socklen_t, '__addr_len']]))('sendto');},
    recvfrom: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(null), '__buf'], [T.size_t, '__n'], [T.i32, '__flags'], [Pointer(Struct('sockaddr', null)), '__addr'], [Pointer(T.socklen_t), '__addr_len']]))('recvfrom');},
    sendmsg: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('msghdr', null)), '__message'], [T.i32, '__flags']]))('sendmsg');},
    recvmsg: function() {return (Fn(T.ssize_t, [[T.i32, '__fd'], [Pointer(Struct('msghdr', null)), '__message'], [T.i32, '__flags']]))('recvmsg');},
    getsockopt: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__level'], [T.i32, '__optname'], [Pointer(null), '__optval'], [Pointer(T.socklen_t), '__optlen']], [['nothrow'], ['leaf']]))('getsockopt');},
    setsockopt: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__level'], [T.i32, '__optname'], [Pointer(null), '__optval'], [T.socklen_t, '__optlen']], [['nothrow'], ['leaf']]))('setsockopt');},
    listen: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__n']], [['nothrow'], ['leaf']]))('listen');},
    accept: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('sockaddr', null)), '__addr'], [Pointer(T.socklen_t), '__addr_len']]))('accept');},
    shutdown: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__how']], [['nothrow'], ['leaf']]))('shutdown');},
    sockatmark: function() {return (Fn(T.i32, [[T.i32, '__fd']], [['nothrow'], ['leaf']]))('sockatmark');},
    isfdtype: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.i32, '__fdtype']], [['nothrow'], ['leaf']]))('isfdtype');},
    stat: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [Pointer(Struct('stat', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('stat');},
    fstat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(Struct('stat', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('fstat');},
    fstatat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__file'], [Pointer(Struct('stat', null)), '__buf'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('fstatat');},
    lstat: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [Pointer(Struct('stat', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('lstat');},
    chmod: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('chmod');},
    lchmod: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('lchmod');},
    fchmod: function() {return (Fn(T.i32, [[T.i32, '__fd'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf']]))('fchmod');},
    fchmodat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__file'], [T.__mode_t, '__mode'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('fchmodat');},
    umask: function() {return (Fn(T.__mode_t, [[T.__mode_t, '__mask']], [['nothrow'], ['leaf']]))('umask');},
    mkdir: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('mkdir');},
    mkdirat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__path'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('mkdirat');},
    mknod: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [T.__mode_t, '__mode'], [T.__dev_t, '__dev']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('mknod');},
    mknodat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__path'], [T.__mode_t, '__mode'], [T.__dev_t, '__dev']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('mknodat');},
    mkfifo: function() {return (Fn(T.i32, [[Pointer(T.char), '__path'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}]]))('mkfifo');},
    mkfifoat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__path'], [T.__mode_t, '__mode']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('mkfifoat');},
    utimensat: function() {return (Fn(T.i32, [[T.i32, '__fd'], [Pointer(T.char), '__path'], [ArrayType(Struct('timespec', null), 2), '__times'], [T.i32, '__flags']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('utimensat');},
    futimens: function() {return (Fn(T.i32, [[T.i32, '__fd'], [ArrayType(Struct('timespec', null), 2), '__times']], [['nothrow'], ['leaf']]))('futimens');},
    __fxstat: function() {return (Fn(T.i32, [[T.i32, '__ver'], [T.i32, '__fildes'], [Pointer(Struct('stat', null)), '__stat_buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}]]))('__fxstat');},
    __xstat: function() {return (Fn(T.i32, [[T.i32, '__ver'], [Pointer(T.char), '__filename'], [Pointer(Struct('stat', null)), '__stat_buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('__xstat');},
    __lxstat: function() {return (Fn(T.i32, [[T.i32, '__ver'], [Pointer(T.char), '__filename'], [Pointer(Struct('stat', null)), '__stat_buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"3"}]]))('__lxstat');},
    __fxstatat: function() {return (Fn(T.i32, [[T.i32, '__ver'], [T.i32, '__fildes'], [Pointer(T.char), '__filename'], [Pointer(Struct('stat', null)), '__stat_buf'], [T.i32, '__flag']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"4"}]]))('__fxstatat');},
    __xmknod: function() {return (Fn(T.i32, [[T.i32, '__ver'], [Pointer(T.char), '__path'], [T.__mode_t, '__mode'], [Pointer(T.__dev_t), '__dev']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}, {"__rule":"constant","_0":"4"}]]))('__xmknod');},
    __xmknodat: function() {return (Fn(T.i32, [[T.i32, '__ver'], [T.i32, '__fd'], [Pointer(T.char), '__path'], [T.__mode_t, '__mode'], [Pointer(T.__dev_t), '__dev']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"3"}, {"__rule":"constant","_0":"5"}]]))('__xmknodat');},
    statfs: function() {return (Fn(T.i32, [[Pointer(T.char), '__file'], [Pointer(Struct('statfs', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"1"}, {"__rule":"constant","_0":"2"}]]))('statfs');},
    fstatfs: function() {return (Fn(T.i32, [[T.i32, '__fildes'], [Pointer(Struct('statfs', null)), '__buf']], [['nothrow'], ['leaf'], ['nonnull', {"__rule":"constant","_0":"2"}]]))('fstatfs');},
    glClearIndex: function() {return (Fn(null, [[T.GLfloat, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearIndex');},
    glClearColor: function() {return (Fn(null, [[T.GLclampf, 'red'], [T.GLclampf, 'green'], [T.GLclampf, 'blue'], [T.GLclampf, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearColor');},
    glClear: function() {return (Fn(null, [[T.GLbitfield, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClear');},
    glIndexMask: function() {return (Fn(null, [[T.GLuint, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexMask');},
    glColorMask: function() {return (Fn(null, [[T.GLboolean, 'red'], [T.GLboolean, 'green'], [T.GLboolean, 'blue'], [T.GLboolean, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorMask');},
    glAlphaFunc: function() {return (Fn(null, [[T.GLenum, 'func'], [T.GLclampf, 'ref']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glAlphaFunc');},
    glBlendFunc: function() {return (Fn(null, [[T.GLenum, 'sfactor'], [T.GLenum, 'dfactor']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBlendFunc');},
    glLogicOp: function() {return (Fn(null, [[T.GLenum, 'opcode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLogicOp');},
    glCullFace: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCullFace');},
    glFrontFace: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFrontFace');},
    glPointSize: function() {return (Fn(null, [[T.GLfloat, 'size']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPointSize');},
    glLineWidth: function() {return (Fn(null, [[T.GLfloat, 'width']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLineWidth');},
    glLineStipple: function() {return (Fn(null, [[T.GLint, 'factor'], [T.GLushort, 'pattern']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLineStipple');},
    glPolygonMode: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPolygonMode');},
    glPolygonOffset: function() {return (Fn(null, [[T.GLfloat, 'factor'], [T.GLfloat, 'units']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPolygonOffset');},
    glPolygonStipple: function() {return (Fn(null, [[Pointer(T.GLubyte), 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPolygonStipple');},
    glGetPolygonStipple: function() {return (Fn(null, [[Pointer(T.GLubyte), 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetPolygonStipple');},
    glEdgeFlag: function() {return (Fn(null, [[T.GLboolean, 'flag']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEdgeFlag');},
    glEdgeFlagv: function() {return (Fn(null, [[Pointer(T.GLboolean), 'flag']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEdgeFlagv');},
    glScissor: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glScissor');},
    glClipPlane: function() {return (Fn(null, [[T.GLenum, 'plane'], [Pointer(T.GLdouble), 'equation']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClipPlane');},
    glGetClipPlane: function() {return (Fn(null, [[T.GLenum, 'plane'], [Pointer(T.GLdouble), 'equation']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetClipPlane');},
    glDrawBuffer: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDrawBuffer');},
    glReadBuffer: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glReadBuffer');},
    glEnable: function() {return (Fn(null, [[T.GLenum, 'cap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEnable');},
    glDisable: function() {return (Fn(null, [[T.GLenum, 'cap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDisable');},
    glIsEnabled: function() {return (Fn(T.GLboolean, [[T.GLenum, 'cap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIsEnabled');},
    glEnableClientState: function() {return (Fn(null, [[T.GLenum, 'cap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEnableClientState');},
    glDisableClientState: function() {return (Fn(null, [[T.GLenum, 'cap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDisableClientState');},
    glGetBooleanv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLboolean), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetBooleanv');},
    glGetDoublev: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetDoublev');},
    glGetFloatv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetFloatv');},
    glGetIntegerv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetIntegerv');},
    glPushAttrib: function() {return (Fn(null, [[T.GLbitfield, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPushAttrib');},
    glPopAttrib: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPopAttrib');},
    glPushClientAttrib: function() {return (Fn(null, [[T.GLbitfield, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPushClientAttrib');},
    glPopClientAttrib: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPopClientAttrib');},
    glRenderMode: function() {return (Fn(T.GLint, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRenderMode');},
    glGetError: function() {return (Fn(T.GLenum, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetError');},
    glGetString: function() {return (Fn(Pointer(T.GLubyte), [[T.GLenum, 'name']], [['visibility', {"__rule":"string","_0":"\"default\""}], ['const']]))('glGetString');},
    glFinish: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFinish');},
    glFlush: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFlush');},
    glHint: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glHint');},
    glClearDepth: function() {return (Fn(null, [[T.GLclampd, 'depth']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearDepth');},
    glDepthFunc: function() {return (Fn(null, [[T.GLenum, 'func']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDepthFunc');},
    glDepthMask: function() {return (Fn(null, [[T.GLboolean, 'flag']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDepthMask');},
    glDepthRange: function() {return (Fn(null, [[T.GLclampd, 'near_val'], [T.GLclampd, 'far_val']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDepthRange');},
    glClearAccum: function() {return (Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue'], [T.GLfloat, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearAccum');},
    glAccum: function() {return (Fn(null, [[T.GLenum, 'op'], [T.GLfloat, 'value']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glAccum');},
    glMatrixMode: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMatrixMode');},
    glOrtho: function() {return (Fn(null, [[T.GLdouble, 'left'], [T.GLdouble, 'right'], [T.GLdouble, 'bottom'], [T.GLdouble, 'top'], [T.GLdouble, 'near_val'], [T.GLdouble, 'far_val']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glOrtho');},
    glFrustum: function() {return (Fn(null, [[T.GLdouble, 'left'], [T.GLdouble, 'right'], [T.GLdouble, 'bottom'], [T.GLdouble, 'top'], [T.GLdouble, 'near_val'], [T.GLdouble, 'far_val']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFrustum');},
    glViewport: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glViewport');},
    glPushMatrix: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPushMatrix');},
    glPopMatrix: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPopMatrix');},
    glLoadIdentity: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadIdentity');},
    glLoadMatrixd: function() {return (Fn(null, [[Pointer(T.GLdouble), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadMatrixd');},
    glLoadMatrixf: function() {return (Fn(null, [[Pointer(T.GLfloat), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadMatrixf');},
    glMultMatrixd: function() {return (Fn(null, [[Pointer(T.GLdouble), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultMatrixd');},
    glMultMatrixf: function() {return (Fn(null, [[Pointer(T.GLfloat), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultMatrixf');},
    glRotated: function() {return (Fn(null, [[T.GLdouble, 'angle'], [T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRotated');},
    glRotatef: function() {return (Fn(null, [[T.GLfloat, 'angle'], [T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRotatef');},
    glScaled: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glScaled');},
    glScalef: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glScalef');},
    glTranslated: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTranslated');},
    glTranslatef: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTranslatef');},
    glIsList: function() {return (Fn(T.GLboolean, [[T.GLuint, 'list']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIsList');},
    glDeleteLists: function() {return (Fn(null, [[T.GLuint, 'list'], [T.GLsizei, 'range']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDeleteLists');},
    glGenLists: function() {return (Fn(T.GLuint, [[T.GLsizei, 'range']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGenLists');},
    glNewList: function() {return (Fn(null, [[T.GLuint, 'list'], [T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNewList');},
    glEndList: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEndList');},
    glCallList: function() {return (Fn(null, [[T.GLuint, 'list']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCallList');},
    glCallLists: function() {return (Fn(null, [[T.GLsizei, 'n'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'lists']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCallLists');},
    glListBase: function() {return (Fn(null, [[T.GLuint, 'base']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glListBase');},
    glBegin: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBegin');},
    glEnd: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEnd');},
    glVertex2d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2d');},
    glVertex2f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2f');},
    glVertex2i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2i');},
    glVertex2s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2s');},
    glVertex3d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3d');},
    glVertex3f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3f');},
    glVertex3i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3i');},
    glVertex3s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3s');},
    glVertex4d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4d');},
    glVertex4f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4f');},
    glVertex4i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4i');},
    glVertex4s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4s');},
    glVertex2dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2dv');},
    glVertex2fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2fv');},
    glVertex2iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2iv');},
    glVertex2sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex2sv');},
    glVertex3dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3dv');},
    glVertex3fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3fv');},
    glVertex3iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3iv');},
    glVertex3sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex3sv');},
    glVertex4dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4dv');},
    glVertex4fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4fv');},
    glVertex4iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4iv');},
    glVertex4sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertex4sv');},
    glNormal3b: function() {return (Fn(null, [[T.GLbyte, 'nx'], [T.GLbyte, 'ny'], [T.GLbyte, 'nz']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3b');},
    glNormal3d: function() {return (Fn(null, [[T.GLdouble, 'nx'], [T.GLdouble, 'ny'], [T.GLdouble, 'nz']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3d');},
    glNormal3f: function() {return (Fn(null, [[T.GLfloat, 'nx'], [T.GLfloat, 'ny'], [T.GLfloat, 'nz']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3f');},
    glNormal3i: function() {return (Fn(null, [[T.GLint, 'nx'], [T.GLint, 'ny'], [T.GLint, 'nz']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3i');},
    glNormal3s: function() {return (Fn(null, [[T.GLshort, 'nx'], [T.GLshort, 'ny'], [T.GLshort, 'nz']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3s');},
    glNormal3bv: function() {return (Fn(null, [[Pointer(T.GLbyte), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3bv');},
    glNormal3dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3dv');},
    glNormal3fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3fv');},
    glNormal3iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3iv');},
    glNormal3sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormal3sv');},
    glIndexd: function() {return (Fn(null, [[T.GLdouble, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexd');},
    glIndexf: function() {return (Fn(null, [[T.GLfloat, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexf');},
    glIndexi: function() {return (Fn(null, [[T.GLint, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexi');},
    glIndexs: function() {return (Fn(null, [[T.GLshort, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexs');},
    glIndexub: function() {return (Fn(null, [[T.GLubyte, 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexub');},
    glIndexdv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexdv');},
    glIndexfv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexfv');},
    glIndexiv: function() {return (Fn(null, [[Pointer(T.GLint), 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexiv');},
    glIndexsv: function() {return (Fn(null, [[Pointer(T.GLshort), 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexsv');},
    glIndexubv: function() {return (Fn(null, [[Pointer(T.GLubyte), 'c']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexubv');},
    glColor3b: function() {return (Fn(null, [[T.GLbyte, 'red'], [T.GLbyte, 'green'], [T.GLbyte, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3b');},
    glColor3d: function() {return (Fn(null, [[T.GLdouble, 'red'], [T.GLdouble, 'green'], [T.GLdouble, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3d');},
    glColor3f: function() {return (Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3f');},
    glColor3i: function() {return (Fn(null, [[T.GLint, 'red'], [T.GLint, 'green'], [T.GLint, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3i');},
    glColor3s: function() {return (Fn(null, [[T.GLshort, 'red'], [T.GLshort, 'green'], [T.GLshort, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3s');},
    glColor3ub: function() {return (Fn(null, [[T.GLubyte, 'red'], [T.GLubyte, 'green'], [T.GLubyte, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3ub');},
    glColor3ui: function() {return (Fn(null, [[T.GLuint, 'red'], [T.GLuint, 'green'], [T.GLuint, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3ui');},
    glColor3us: function() {return (Fn(null, [[T.GLushort, 'red'], [T.GLushort, 'green'], [T.GLushort, 'blue']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3us');},
    glColor4b: function() {return (Fn(null, [[T.GLbyte, 'red'], [T.GLbyte, 'green'], [T.GLbyte, 'blue'], [T.GLbyte, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4b');},
    glColor4d: function() {return (Fn(null, [[T.GLdouble, 'red'], [T.GLdouble, 'green'], [T.GLdouble, 'blue'], [T.GLdouble, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4d');},
    glColor4f: function() {return (Fn(null, [[T.GLfloat, 'red'], [T.GLfloat, 'green'], [T.GLfloat, 'blue'], [T.GLfloat, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4f');},
    glColor4i: function() {return (Fn(null, [[T.GLint, 'red'], [T.GLint, 'green'], [T.GLint, 'blue'], [T.GLint, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4i');},
    glColor4s: function() {return (Fn(null, [[T.GLshort, 'red'], [T.GLshort, 'green'], [T.GLshort, 'blue'], [T.GLshort, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4s');},
    glColor4ub: function() {return (Fn(null, [[T.GLubyte, 'red'], [T.GLubyte, 'green'], [T.GLubyte, 'blue'], [T.GLubyte, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4ub');},
    glColor4ui: function() {return (Fn(null, [[T.GLuint, 'red'], [T.GLuint, 'green'], [T.GLuint, 'blue'], [T.GLuint, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4ui');},
    glColor4us: function() {return (Fn(null, [[T.GLushort, 'red'], [T.GLushort, 'green'], [T.GLushort, 'blue'], [T.GLushort, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4us');},
    glColor3bv: function() {return (Fn(null, [[Pointer(T.GLbyte), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3bv');},
    glColor3dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3dv');},
    glColor3fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3fv');},
    glColor3iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3iv');},
    glColor3sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3sv');},
    glColor3ubv: function() {return (Fn(null, [[Pointer(T.GLubyte), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3ubv');},
    glColor3uiv: function() {return (Fn(null, [[Pointer(T.GLuint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3uiv');},
    glColor3usv: function() {return (Fn(null, [[Pointer(T.GLushort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor3usv');},
    glColor4bv: function() {return (Fn(null, [[Pointer(T.GLbyte), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4bv');},
    glColor4dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4dv');},
    glColor4fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4fv');},
    glColor4iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4iv');},
    glColor4sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4sv');},
    glColor4ubv: function() {return (Fn(null, [[Pointer(T.GLubyte), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4ubv');},
    glColor4uiv: function() {return (Fn(null, [[Pointer(T.GLuint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4uiv');},
    glColor4usv: function() {return (Fn(null, [[Pointer(T.GLushort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColor4usv');},
    glTexCoord1d: function() {return (Fn(null, [[T.GLdouble, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1d');},
    glTexCoord1f: function() {return (Fn(null, [[T.GLfloat, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1f');},
    glTexCoord1i: function() {return (Fn(null, [[T.GLint, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1i');},
    glTexCoord1s: function() {return (Fn(null, [[T.GLshort, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1s');},
    glTexCoord2d: function() {return (Fn(null, [[T.GLdouble, 's'], [T.GLdouble, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2d');},
    glTexCoord2f: function() {return (Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2f');},
    glTexCoord2i: function() {return (Fn(null, [[T.GLint, 's'], [T.GLint, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2i');},
    glTexCoord2s: function() {return (Fn(null, [[T.GLshort, 's'], [T.GLshort, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2s');},
    glTexCoord3d: function() {return (Fn(null, [[T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3d');},
    glTexCoord3f: function() {return (Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3f');},
    glTexCoord3i: function() {return (Fn(null, [[T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3i');},
    glTexCoord3s: function() {return (Fn(null, [[T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3s');},
    glTexCoord4d: function() {return (Fn(null, [[T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r'], [T.GLdouble, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4d');},
    glTexCoord4f: function() {return (Fn(null, [[T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4f');},
    glTexCoord4i: function() {return (Fn(null, [[T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r'], [T.GLint, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4i');},
    glTexCoord4s: function() {return (Fn(null, [[T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r'], [T.GLshort, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4s');},
    glTexCoord1dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1dv');},
    glTexCoord1fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1fv');},
    glTexCoord1iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1iv');},
    glTexCoord1sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord1sv');},
    glTexCoord2dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2dv');},
    glTexCoord2fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2fv');},
    glTexCoord2iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2iv');},
    glTexCoord2sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord2sv');},
    glTexCoord3dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3dv');},
    glTexCoord3fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3fv');},
    glTexCoord3iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3iv');},
    glTexCoord3sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord3sv');},
    glTexCoord4dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4dv');},
    glTexCoord4fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4fv');},
    glTexCoord4iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4iv');},
    glTexCoord4sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoord4sv');},
    glRasterPos2d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2d');},
    glRasterPos2f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2f');},
    glRasterPos2i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2i');},
    glRasterPos2s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2s');},
    glRasterPos3d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3d');},
    glRasterPos3f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3f');},
    glRasterPos3i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3i');},
    glRasterPos3s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3s');},
    glRasterPos4d: function() {return (Fn(null, [[T.GLdouble, 'x'], [T.GLdouble, 'y'], [T.GLdouble, 'z'], [T.GLdouble, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4d');},
    glRasterPos4f: function() {return (Fn(null, [[T.GLfloat, 'x'], [T.GLfloat, 'y'], [T.GLfloat, 'z'], [T.GLfloat, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4f');},
    glRasterPos4i: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLint, 'z'], [T.GLint, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4i');},
    glRasterPos4s: function() {return (Fn(null, [[T.GLshort, 'x'], [T.GLshort, 'y'], [T.GLshort, 'z'], [T.GLshort, 'w']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4s');},
    glRasterPos2dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2dv');},
    glRasterPos2fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2fv');},
    glRasterPos2iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2iv');},
    glRasterPos2sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos2sv');},
    glRasterPos3dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3dv');},
    glRasterPos3fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3fv');},
    glRasterPos3iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3iv');},
    glRasterPos3sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos3sv');},
    glRasterPos4dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4dv');},
    glRasterPos4fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4fv');},
    glRasterPos4iv: function() {return (Fn(null, [[Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4iv');},
    glRasterPos4sv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRasterPos4sv');},
    glRectd: function() {return (Fn(null, [[T.GLdouble, 'x1'], [T.GLdouble, 'y1'], [T.GLdouble, 'x2'], [T.GLdouble, 'y2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectd');},
    glRectf: function() {return (Fn(null, [[T.GLfloat, 'x1'], [T.GLfloat, 'y1'], [T.GLfloat, 'x2'], [T.GLfloat, 'y2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectf');},
    glRecti: function() {return (Fn(null, [[T.GLint, 'x1'], [T.GLint, 'y1'], [T.GLint, 'x2'], [T.GLint, 'y2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRecti');},
    glRects: function() {return (Fn(null, [[T.GLshort, 'x1'], [T.GLshort, 'y1'], [T.GLshort, 'x2'], [T.GLshort, 'y2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRects');},
    glRectdv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'v1'], [Pointer(T.GLdouble), 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectdv');},
    glRectfv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'v1'], [Pointer(T.GLfloat), 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectfv');},
    glRectiv: function() {return (Fn(null, [[Pointer(T.GLint), 'v1'], [Pointer(T.GLint), 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectiv');},
    glRectsv: function() {return (Fn(null, [[Pointer(T.GLshort), 'v1'], [Pointer(T.GLshort), 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glRectsv');},
    glVertexPointer: function() {return (Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glVertexPointer');},
    glNormalPointer: function() {return (Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glNormalPointer');},
    glColorPointer: function() {return (Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorPointer');},
    glIndexPointer: function() {return (Fn(null, [[T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIndexPointer');},
    glTexCoordPointer: function() {return (Fn(null, [[T.GLint, 'size'], [T.GLenum, 'type'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexCoordPointer');},
    glEdgeFlagPointer: function() {return (Fn(null, [[T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'ptr']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEdgeFlagPointer');},
    glGetPointerv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(Pointer(T.GLvoid)), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetPointerv');},
    glArrayElement: function() {return (Fn(null, [[T.GLint, 'i']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glArrayElement');},
    glDrawArrays: function() {return (Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'first'], [T.GLsizei, 'count']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDrawArrays');},
    glDrawElements: function() {return (Fn(null, [[T.GLenum, 'mode'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDrawElements');},
    glInterleavedArrays: function() {return (Fn(null, [[T.GLenum, 'format'], [T.GLsizei, 'stride'], [Pointer(T.GLvoid), 'pointer']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glInterleavedArrays');},
    glShadeModel: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glShadeModel');},
    glLightf: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightf');},
    glLighti: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLighti');},
    glLightfv: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightfv');},
    glLightiv: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightiv');},
    glGetLightfv: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetLightfv');},
    glGetLightiv: function() {return (Fn(null, [[T.GLenum, 'light'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetLightiv');},
    glLightModelf: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightModelf');},
    glLightModeli: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightModeli');},
    glLightModelfv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightModelfv');},
    glLightModeliv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLightModeliv');},
    glMaterialf: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMaterialf');},
    glMateriali: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMateriali');},
    glMaterialfv: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMaterialfv');},
    glMaterialiv: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMaterialiv');},
    glGetMaterialfv: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMaterialfv');},
    glGetMaterialiv: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMaterialiv');},
    glColorMaterial: function() {return (Fn(null, [[T.GLenum, 'face'], [T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorMaterial');},
    glPixelZoom: function() {return (Fn(null, [[T.GLfloat, 'xfactor'], [T.GLfloat, 'yfactor']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelZoom');},
    glPixelStoref: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelStoref');},
    glPixelStorei: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelStorei');},
    glPixelTransferf: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelTransferf');},
    glPixelTransferi: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelTransferi');},
    glPixelMapfv: function() {return (Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'mapsize'], [Pointer(T.GLfloat), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelMapfv');},
    glPixelMapuiv: function() {return (Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'mapsize'], [Pointer(T.GLuint), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelMapuiv');},
    glPixelMapusv: function() {return (Fn(null, [[T.GLenum, 'map'], [T.GLsizei, 'mapsize'], [Pointer(T.GLushort), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPixelMapusv');},
    glGetPixelMapfv: function() {return (Fn(null, [[T.GLenum, 'map'], [Pointer(T.GLfloat), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetPixelMapfv');},
    glGetPixelMapuiv: function() {return (Fn(null, [[T.GLenum, 'map'], [Pointer(T.GLuint), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetPixelMapuiv');},
    glGetPixelMapusv: function() {return (Fn(null, [[T.GLenum, 'map'], [Pointer(T.GLushort), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetPixelMapusv');},
    glBitmap: function() {return (Fn(null, [[T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLfloat, 'xorig'], [T.GLfloat, 'yorig'], [T.GLfloat, 'xmove'], [T.GLfloat, 'ymove'], [Pointer(T.GLubyte), 'bitmap']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBitmap');},
    glReadPixels: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glReadPixels');},
    glDrawPixels: function() {return (Fn(null, [[T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDrawPixels');},
    glCopyPixels: function() {return (Fn(null, [[T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'type']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyPixels');},
    glStencilFunc: function() {return (Fn(null, [[T.GLenum, 'func'], [T.GLint, 'ref'], [T.GLuint, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glStencilFunc');},
    glStencilMask: function() {return (Fn(null, [[T.GLuint, 'mask']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glStencilMask');},
    glStencilOp: function() {return (Fn(null, [[T.GLenum, 'fail'], [T.GLenum, 'zfail'], [T.GLenum, 'zpass']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glStencilOp');},
    glClearStencil: function() {return (Fn(null, [[T.GLint, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearStencil');},
    glTexGend: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLdouble, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGend');},
    glTexGenf: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGenf');},
    glTexGeni: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGeni');},
    glTexGendv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGendv');},
    glTexGenfv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGenfv');},
    glTexGeniv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexGeniv');},
    glGetTexGendv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLdouble), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexGendv');},
    glGetTexGenfv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexGenfv');},
    glGetTexGeniv: function() {return (Fn(null, [[T.GLenum, 'coord'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexGeniv');},
    glTexEnvf: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexEnvf');},
    glTexEnvi: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexEnvi');},
    glTexEnvfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexEnvfv');},
    glTexEnviv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexEnviv');},
    glGetTexEnvfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexEnvfv');},
    glGetTexEnviv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexEnviv');},
    glTexParameterf: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexParameterf');},
    glTexParameteri: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexParameteri');},
    glTexParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexParameterfv');},
    glTexParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexParameteriv');},
    glGetTexParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexParameterfv');},
    glGetTexParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexParameteriv');},
    glGetTexLevelParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexLevelParameterfv');},
    glGetTexLevelParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexLevelParameteriv');},
    glTexImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexImage1D');},
    glTexImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexImage2D');},
    glGetTexImage: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetTexImage');},
    glGenTextures: function() {return (Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGenTextures');},
    glDeleteTextures: function() {return (Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDeleteTextures');},
    glBindTexture: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLuint, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBindTexture');},
    glPrioritizeTextures: function() {return (Fn(null, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures'], [Pointer(T.GLclampf), 'priorities']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPrioritizeTextures');},
    glAreTexturesResident: function() {return (Fn(T.GLboolean, [[T.GLsizei, 'n'], [Pointer(T.GLuint), 'textures'], [Pointer(T.GLboolean), 'residences']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glAreTexturesResident');},
    glIsTexture: function() {return (Fn(T.GLboolean, [[T.GLuint, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glIsTexture');},
    glTexSubImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexSubImage1D');},
    glTexSubImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexSubImage2D');},
    glCopyTexImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLint, 'border']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyTexImage1D');},
    glCopyTexImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyTexImage2D');},
    glCopyTexSubImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyTexSubImage1D');},
    glCopyTexSubImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyTexSubImage2D');},
    glMap1d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'stride'], [T.GLint, 'order'], [Pointer(T.GLdouble), 'points']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMap1d');},
    glMap1f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'stride'], [T.GLint, 'order'], [Pointer(T.GLfloat), 'points']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMap1f');},
    glMap2d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [Pointer(T.GLdouble), 'points']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMap2d');},
    glMap2f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'ustride'], [T.GLint, 'uorder'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2'], [T.GLint, 'vstride'], [T.GLint, 'vorder'], [Pointer(T.GLfloat), 'points']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMap2f');},
    glGetMapdv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMapdv');},
    glGetMapfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMapfv');},
    glGetMapiv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'query'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMapiv');},
    glEvalCoord1d: function() {return (Fn(null, [[T.GLdouble, 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord1d');},
    glEvalCoord1f: function() {return (Fn(null, [[T.GLfloat, 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord1f');},
    glEvalCoord1dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord1dv');},
    glEvalCoord1fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord1fv');},
    glEvalCoord2d: function() {return (Fn(null, [[T.GLdouble, 'u'], [T.GLdouble, 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord2d');},
    glEvalCoord2f: function() {return (Fn(null, [[T.GLfloat, 'u'], [T.GLfloat, 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord2f');},
    glEvalCoord2dv: function() {return (Fn(null, [[Pointer(T.GLdouble), 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord2dv');},
    glEvalCoord2fv: function() {return (Fn(null, [[Pointer(T.GLfloat), 'u']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalCoord2fv');},
    glMapGrid1d: function() {return (Fn(null, [[T.GLint, 'un'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMapGrid1d');},
    glMapGrid1f: function() {return (Fn(null, [[T.GLint, 'un'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMapGrid1f');},
    glMapGrid2d: function() {return (Fn(null, [[T.GLint, 'un'], [T.GLdouble, 'u1'], [T.GLdouble, 'u2'], [T.GLint, 'vn'], [T.GLdouble, 'v1'], [T.GLdouble, 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMapGrid2d');},
    glMapGrid2f: function() {return (Fn(null, [[T.GLint, 'un'], [T.GLfloat, 'u1'], [T.GLfloat, 'u2'], [T.GLint, 'vn'], [T.GLfloat, 'v1'], [T.GLfloat, 'v2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMapGrid2f');},
    glEvalPoint1: function() {return (Fn(null, [[T.GLint, 'i']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalPoint1');},
    glEvalPoint2: function() {return (Fn(null, [[T.GLint, 'i'], [T.GLint, 'j']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalPoint2');},
    glEvalMesh1: function() {return (Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'i1'], [T.GLint, 'i2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalMesh1');},
    glEvalMesh2: function() {return (Fn(null, [[T.GLenum, 'mode'], [T.GLint, 'i1'], [T.GLint, 'i2'], [T.GLint, 'j1'], [T.GLint, 'j2']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glEvalMesh2');},
    glFogf: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLfloat, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFogf');},
    glFogi: function() {return (Fn(null, [[T.GLenum, 'pname'], [T.GLint, 'param']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFogi');},
    glFogfv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFogfv');},
    glFogiv: function() {return (Fn(null, [[T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFogiv');},
    glFeedbackBuffer: function() {return (Fn(null, [[T.GLsizei, 'size'], [T.GLenum, 'type'], [Pointer(T.GLfloat), 'buffer']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glFeedbackBuffer');},
    glPassThrough: function() {return (Fn(null, [[T.GLfloat, 'token']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPassThrough');},
    glSelectBuffer: function() {return (Fn(null, [[T.GLsizei, 'size'], [Pointer(T.GLuint), 'buffer']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glSelectBuffer');},
    glInitNames: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glInitNames');},
    glLoadName: function() {return (Fn(null, [[T.GLuint, 'name']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadName');},
    glPushName: function() {return (Fn(null, [[T.GLuint, 'name']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPushName');},
    glPopName: function() {return (Fn(null, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glPopName');},
    glDrawRangeElements: function() {return (Fn(null, [[T.GLenum, 'mode'], [T.GLuint, 'start'], [T.GLuint, 'end'], [T.GLsizei, 'count'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'indices']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glDrawRangeElements');},
    glTexImage3D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'internalFormat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexImage3D');},
    glTexSubImage3D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'pixels']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glTexSubImage3D');},
    glCopyTexSubImage3D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyTexSubImage3D');},
    glColorTable: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'table']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorTable');},
    glColorSubTable: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'start'], [T.GLsizei, 'count'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorSubTable');},
    glColorTableParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorTableParameteriv');},
    glColorTableParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glColorTableParameterfv');},
    glCopyColorSubTable: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'start'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyColorSubTable');},
    glCopyColorTable: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyColorTable');},
    glGetColorTable: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'table']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetColorTable');},
    glGetColorTableParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetColorTableParameterfv');},
    glGetColorTableParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetColorTableParameteriv');},
    glBlendEquation: function() {return (Fn(null, [[T.GLenum, 'mode']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBlendEquation');},
    glBlendColor: function() {return (Fn(null, [[T.GLclampf, 'red'], [T.GLclampf, 'green'], [T.GLclampf, 'blue'], [T.GLclampf, 'alpha']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBlendColor');},
    glHistogram: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'width'], [T.GLenum, 'internalformat'], [T.GLboolean, 'sink']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glHistogram');},
    glResetHistogram: function() {return (Fn(null, [[T.GLenum, 'target']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glResetHistogram');},
    glGetHistogram: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetHistogram');},
    glGetHistogramParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetHistogramParameterfv');},
    glGetHistogramParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetHistogramParameteriv');},
    glMinmax: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLboolean, 'sink']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMinmax');},
    glResetMinmax: function() {return (Fn(null, [[T.GLenum, 'target']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glResetMinmax');},
    glGetMinmax: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLboolean, 'reset'], [T.GLenum, 'format'], [T.GLenum, 'types'], [Pointer(T.GLvoid), 'values']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMinmax');},
    glGetMinmaxParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMinmaxParameterfv');},
    glGetMinmaxParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetMinmaxParameteriv');},
    glConvolutionFilter1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionFilter1D');},
    glConvolutionFilter2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionFilter2D');},
    glConvolutionParameterf: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLfloat, 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionParameterf');},
    glConvolutionParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionParameterfv');},
    glConvolutionParameteri: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [T.GLint, 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionParameteri');},
    glConvolutionParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glConvolutionParameteriv');},
    glCopyConvolutionFilter1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyConvolutionFilter1D');},
    glCopyConvolutionFilter2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLint, 'x'], [T.GLint, 'y'], [T.GLsizei, 'width'], [T.GLsizei, 'height']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCopyConvolutionFilter2D');},
    glGetConvolutionFilter: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'image']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetConvolutionFilter');},
    glGetConvolutionParameterfv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLfloat), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetConvolutionParameterfv');},
    glGetConvolutionParameteriv: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'pname'], [Pointer(T.GLint), 'params']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetConvolutionParameteriv');},
    glSeparableFilter2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'row'], [Pointer(T.GLvoid), 'column']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glSeparableFilter2D');},
    glGetSeparableFilter: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLenum, 'format'], [T.GLenum, 'type'], [Pointer(T.GLvoid), 'row'], [Pointer(T.GLvoid), 'column'], [Pointer(T.GLvoid), 'span']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetSeparableFilter');},
    glActiveTexture: function() {return (Fn(null, [[T.GLenum, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glActiveTexture');},
    glClientActiveTexture: function() {return (Fn(null, [[T.GLenum, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClientActiveTexture');},
    glCompressedTexImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexImage1D');},
    glCompressedTexImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexImage2D');},
    glCompressedTexImage3D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLenum, 'internalformat'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLint, 'border'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexImage3D');},
    glCompressedTexSubImage1D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLsizei, 'width'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexSubImage1D');},
    glCompressedTexSubImage2D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexSubImage2D');},
    glCompressedTexSubImage3D: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'level'], [T.GLint, 'xoffset'], [T.GLint, 'yoffset'], [T.GLint, 'zoffset'], [T.GLsizei, 'width'], [T.GLsizei, 'height'], [T.GLsizei, 'depth'], [T.GLenum, 'format'], [T.GLsizei, 'imageSize'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCompressedTexSubImage3D');},
    glGetCompressedTexImage: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 'lod'], [Pointer(T.GLvoid), 'img']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetCompressedTexImage');},
    glMultiTexCoord1d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1d');},
    glMultiTexCoord1dv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1dv');},
    glMultiTexCoord1f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1f');},
    glMultiTexCoord1fv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1fv');},
    glMultiTexCoord1i: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1i');},
    glMultiTexCoord1iv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1iv');},
    glMultiTexCoord1s: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1s');},
    glMultiTexCoord1sv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1sv');},
    glMultiTexCoord2d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2d');},
    glMultiTexCoord2dv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2dv');},
    glMultiTexCoord2f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2f');},
    glMultiTexCoord2fv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2fv');},
    glMultiTexCoord2i: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2i');},
    glMultiTexCoord2iv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2iv');},
    glMultiTexCoord2s: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2s');},
    glMultiTexCoord2sv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2sv');},
    glMultiTexCoord3d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3d');},
    glMultiTexCoord3dv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3dv');},
    glMultiTexCoord3f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3f');},
    glMultiTexCoord3fv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3fv');},
    glMultiTexCoord3i: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3i');},
    glMultiTexCoord3iv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3iv');},
    glMultiTexCoord3s: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3s');},
    glMultiTexCoord3sv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3sv');},
    glMultiTexCoord4d: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r'], [T.GLdouble, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4d');},
    glMultiTexCoord4dv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4dv');},
    glMultiTexCoord4f: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4f');},
    glMultiTexCoord4fv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4fv');},
    glMultiTexCoord4i: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r'], [T.GLint, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4i');},
    glMultiTexCoord4iv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4iv');},
    glMultiTexCoord4s: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r'], [T.GLshort, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4s');},
    glMultiTexCoord4sv: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4sv');},
    glLoadTransposeMatrixd: function() {return (Fn(null, [[ArrayType(T.GLdouble, 16), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadTransposeMatrixd');},
    glLoadTransposeMatrixf: function() {return (Fn(null, [[ArrayType(T.GLfloat, 16), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glLoadTransposeMatrixf');},
    glMultTransposeMatrixd: function() {return (Fn(null, [[ArrayType(T.GLdouble, 16), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultTransposeMatrixd');},
    glMultTransposeMatrixf: function() {return (Fn(null, [[ArrayType(T.GLfloat, 16), 'm']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultTransposeMatrixf');},
    glSampleCoverage: function() {return (Fn(null, [[T.GLclampf, 'value'], [T.GLboolean, 'invert']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glSampleCoverage');},
    glActiveTextureARB: function() {return (Fn(null, [[T.GLenum, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glActiveTextureARB');},
    glClientActiveTextureARB: function() {return (Fn(null, [[T.GLenum, 'texture']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClientActiveTextureARB');},
    glMultiTexCoord1dARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1dARB');},
    glMultiTexCoord1dvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1dvARB');},
    glMultiTexCoord1fARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1fARB');},
    glMultiTexCoord1fvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1fvARB');},
    glMultiTexCoord1iARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1iARB');},
    glMultiTexCoord1ivARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1ivARB');},
    glMultiTexCoord1sARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1sARB');},
    glMultiTexCoord1svARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord1svARB');},
    glMultiTexCoord2dARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2dARB');},
    glMultiTexCoord2dvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2dvARB');},
    glMultiTexCoord2fARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2fARB');},
    glMultiTexCoord2fvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2fvARB');},
    glMultiTexCoord2iARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2iARB');},
    glMultiTexCoord2ivARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2ivARB');},
    glMultiTexCoord2sARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2sARB');},
    glMultiTexCoord2svARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord2svARB');},
    glMultiTexCoord3dARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3dARB');},
    glMultiTexCoord3dvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3dvARB');},
    glMultiTexCoord3fARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3fARB');},
    glMultiTexCoord3fvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3fvARB');},
    glMultiTexCoord3iARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3iARB');},
    glMultiTexCoord3ivARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3ivARB');},
    glMultiTexCoord3sARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3sARB');},
    glMultiTexCoord3svARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord3svARB');},
    glMultiTexCoord4dARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLdouble, 's'], [T.GLdouble, 't'], [T.GLdouble, 'r'], [T.GLdouble, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4dARB');},
    glMultiTexCoord4dvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLdouble), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4dvARB');},
    glMultiTexCoord4fARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLfloat, 's'], [T.GLfloat, 't'], [T.GLfloat, 'r'], [T.GLfloat, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4fARB');},
    glMultiTexCoord4fvARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4fvARB');},
    glMultiTexCoord4iARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLint, 's'], [T.GLint, 't'], [T.GLint, 'r'], [T.GLint, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4iARB');},
    glMultiTexCoord4ivARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLint), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4ivARB');},
    glMultiTexCoord4sARB: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLshort, 's'], [T.GLshort, 't'], [T.GLshort, 'r'], [T.GLshort, 'q']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4sARB');},
    glMultiTexCoord4svARB: function() {return (Fn(null, [[T.GLenum, 'target'], [Pointer(T.GLshort), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glMultiTexCoord4svARB');},
    imaxabs: function() {return (Fn(T.intmax_t, [[T.intmax_t, '__n']], [['nothrow'], ['leaf'], ['const']]))('imaxabs');},
    imaxdiv: function() {return (Fn(T.imaxdiv_t, [[T.intmax_t, '__numer'], [T.intmax_t, '__denom']], [['nothrow'], ['leaf'], ['const']]))('imaxdiv');},
    strtoimax: function() {return (Fn(T.intmax_t, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('strtoimax');},
    strtoumax: function() {return (Fn(T.uintmax_t, [[Pointer(T.char), '__nptr'], [Pointer(Pointer(T.char)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('strtoumax');},
    wcstoimax: function() {return (Fn(T.intmax_t, [[Pointer(T.__gwchar_t), '__nptr'], [Pointer(Pointer(T.__gwchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstoimax');},
    wcstoumax: function() {return (Fn(T.uintmax_t, [[Pointer(T.__gwchar_t), '__nptr'], [Pointer(Pointer(T.__gwchar_t)), '__endptr'], [T.i32, '__base']], [['nothrow'], ['leaf']]))('wcstoumax');},
    glCreateDebugObjectMESA: function() {return (Fn(T.GLhandleARB, [[null]], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glCreateDebugObjectMESA');},
    glClearDebugLogMESA: function() {return (Fn(null, [[T.GLhandleARB, 'obj'], [T.GLenum, 'logType'], [T.GLenum, 'shaderType']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glClearDebugLogMESA');},
    glGetDebugLogMESA: function() {return (Fn(null, [[T.GLhandleARB, 'obj'], [T.GLenum, 'logType'], [T.GLenum, 'shaderType'], [T.GLsizei, 'maxLength'], [Pointer(T.GLsizei), 'length'], [Pointer(T.GLcharARB), 'debugLog']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetDebugLogMESA');},
    glGetDebugLogLengthMESA: function() {return (Fn(T.GLsizei, [[T.GLhandleARB, 'obj'], [T.GLenum, 'logType'], [T.GLenum, 'shaderType']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetDebugLogLengthMESA');},
    glProgramCallbackMESA: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLprogramcallbackMESA, 'callback'], [Pointer(T.GLvoid), 'data']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glProgramCallbackMESA');},
    glGetProgramRegisterfvMESA: function() {return (Fn(null, [[T.GLenum, 'target'], [T.GLsizei, 'len'], [Pointer(T.GLubyte), 'name'], [Pointer(T.GLfloat), 'v']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glGetProgramRegisterfvMESA');},
    glBlendEquationSeparateATI: function() {return (Fn(null, [[T.GLenum, 'modeRGB'], [T.GLenum, 'modeA']], [['visibility', {"__rule":"string","_0":"\"default\""}]]))('glBlendEquationSeparateATI');}
};
