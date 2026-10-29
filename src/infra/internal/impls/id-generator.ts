import { v4 } from "uuid";
import { IdGenerator } from "../../../_shared/utils-facades.types";

export class IdGeneratorImpl implements IdGenerator {
    generate(): string {
        return v4();
    }
}