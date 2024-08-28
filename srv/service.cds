using { ImgContent ,CapturedScreens} from '../db/schema';



service ImgService {
    entity ImgCon as projection on ImgContent;

    
   
   // action uploadZipAndConvertToPDF (file: Binary, filename: String) returns String;
    entity CapturedScreen as projection on CapturedScreens;
    //action uploadZipAndConvertToPDF(file: LargeBinary) returns String;
    action uploadImage(
    FileName: String, 
    screenImg: LargeBinary, 
    mediaType: String) 
    returns String;
}





