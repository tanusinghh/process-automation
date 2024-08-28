using { cuid } from '@sap/cds/common';


// @cds.persistence.skip
entity ImgContent : cuid {
    key ID: UUID;
     @Core.MediaType
    content   : LargeBinary;
    name: String;
    data: Binary;
}

entity CapturedScreens {
    key FileName : String;
    @Core.MediaType: mediaType
    screenzip : LargeBinary ;
    @Core.IsMediaType: true
    mediaType : String;
}
