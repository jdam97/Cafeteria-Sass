const { src,dest,watch,series,parallel } = require('gulp'); //si veo llaves al lado del const es porque exporta varias funciones, cuando no, sol o exporta 1 funcion

//Dependencias de CSS y SASS
const sass = require('gulp-sass')(require('sass'));// aca fueron 2 dependencias
const postcss=require('gulp-postcss');
const autoprefixer=require('autoprefixer');

//Dependencias de IMAGENES
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif')


function css(done){
// compilar sass
// pasos: 1 - identificar el archivo, 2 - compilarla, 3- guardar el css.
// paso 1
src('src/scss/app.scss')
    // paso 2
    .pipe( sass({outputStyle:'expanded'}) ) //podemos ponerle [{outputStyle:'compressed'}] para que nos compacte el codigo css
    .pipe(postcss( [ autoprefixer() ] ))
    // paso 3
    .pipe(dest('build/css'))
    done ();
}
function imagenes(){
    return src('src/img/**/*') //osea todos los archivos que esten en estas carpetas, puedo usar el reutrn en vez del done
    .pipe(imagemin({optimizationLevel: 3}))
    .pipe( dest('/build/img'));
    
}

function versionWebp(){
    const opciones = {  // aligerar el peso de las imagenes avif
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}') //de todas las imagenes que encuentre en la carpeta, solo traeme las png y jpg
    .pipe(webp(opciones)) //no olvidar pasar opciones como parametro
    .pipe(dest('build/img'))
}

function versionAvif(){
    const opciones = { // aligerar el peso de las imagenes avif
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
    .pipe(avif(opciones)) //no olvidar pasar opciones como parametro
    .pipe(dest('build/img'))
}

//watch: el watch es el "liveserver" que me actualiza automatico los cambios
function dev(){
    //watch('src//scss/header/_header.scss', css);agrego mi nueva hoja de sass al watch para que se actualice automaticamente
    watch('src/scss/**/*.scss',css); //agrego todas las nuevas hojas de sass en esa carpeta src/scss
    //watch('src/scss/app.scss',css); asi agrego mi hoja sass a watch
    watch( 'src/img/**/*',imagenes);
}
exports.css = css;          
exports.dev = dev;
exports.imagenes = imagenes; //se puede hacer esto o colocarlo abajo, cosa que hice
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series(imagenes,versionWebp,versionAvif,css,dev);//siempre dejar watch(dev) hasta el final porque es la que detiene la ejecucion



//series: se inicia una tarea y hasta que finaliza incia la siguiente(mejor ocion en este caso)
//parallels: todas inician al mismo tiempo
