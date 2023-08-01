import * as chokidar from 'chokidar'
async function Watcher(path,callback){
    chokidar.watch(path)
        .on('change',callback)
}

export default Watcher