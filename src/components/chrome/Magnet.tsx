import {useEffect} from "react";
import {initMagnets} from "../../lib/magnet.ts";

export default function Magnet() {
    useEffect(() => initMagnets(), []);
    return null;
}
