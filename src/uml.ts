import { EOL } from "os";

import { Direction, Flags, Format, TypeormUml } from "typeorm-uml";
import { createConnection } from "typeorm";

createConnection().then( async ( connection ) => {
    const flags: Flags = {
        direction: Direction.LR,
        format: Format.SVG
    };

    const typeormUml = new TypeormUml();
    const url = await typeormUml.build( connection, flags );

    process.stdout.write( "Diagram URL: " + url + EOL );
} );