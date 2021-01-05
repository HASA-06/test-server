import dotenv from 'dotenv';
import path from 'path';

function setEnvironment() {
    if(process.env.NODE_ENV === 'production') {
        dotenv.config({ path: path.resolve().concat('\\env\\production.env')    });
    } else if(process.env.NODE_ENV === 'development') {
        dotenv.config({ path: path.resolve().concat('\\env\\development.env')   });

        process.env.GLOBAL__DIR_NAME = path.resolve();
    } else {
        throw new Error('process.env.NODE_ENV가 설정되지 않았습니다.');
    }
}

export default setEnvironment;