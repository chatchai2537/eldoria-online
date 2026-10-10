# แทรก/อัปเดตแพตช์จาก patches/fixNN.js ลง game_built.html (ก่อน </body>) แล้วคัดลอกเป็น index.html
# ใช้: python3 tools/patch-insert.py 81
import sys
n=sys.argv[1];p='game_built.html';s=open(p,encoding='utf8').read();code=open('patches/fix%s.js'%n,encoding='utf8').read()
tag='<script>\n// fix%s '%n
if tag in s:
    a=s.index(tag);b=s.index('</script>',a)+len('</script>');s=s[:a]+'<script>\n'+code+'\n</script>'+s[b:]
else:
    i=s.rindex('</body>');s=s[:i]+'<script>\n'+code+'\n</script>\n\n'+s[i:]
open(p,'w',encoding='utf8').write(s);open('index.html','w',encoding='utf8').write(s);print('ok fix'+n)
