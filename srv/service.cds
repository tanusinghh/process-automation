using { ImgContent ,CapturedScreens} from '../db/schema';



service ImgService {
    entity ImgCon as projection on ImgContent;

    entity CapturedScreen as projection on CapturedScreens;
    action uploadImage(
    FileName: array of String,
    ScreenImg: array of LargeBinary,
    MediaType: array of String
) returns String;
}





