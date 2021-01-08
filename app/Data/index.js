const response = require('./quran.json')
const getSurah = (surahId) =>{
    if(typeof surahId == 'number'){
        return response.data.surahs[surahId - 1]
        //return response
    }else {
        return null
    }
    
}
export { getSurah }