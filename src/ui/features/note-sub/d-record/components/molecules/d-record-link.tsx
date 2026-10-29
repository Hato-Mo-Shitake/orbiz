import { DateTime } from "../../../../../../_shared/date-time.vo";
import { PlainDate } from "../../../../../../_shared/plain-date.vo";
import { DateFormat, DateTimeFormat } from "../../../../../../_shared/types";
import { DRecordId, DRecordPath } from "../../../../../../domain/note-sub/d-record";
import { FileLink } from "../../../../app/components/molecules/file-link";
import { useOrbizSetting } from "../../../../app/hooks/use-orbiz-setting";

type Props = {
    src: DateTime | PlainDate | DRecordId | DRecordPath,
    format?: DateTimeFormat | DateFormat,
    onOpened?: (path: string) => void;
}

export const DRecordLink = ({ src, format = "yyyy-MM-dd_EEE", onOpened }: Props) => {
    const spaceName = useOrbizSetting().spaceName;

    let path: DRecordPath;
    let dateString: string;
    if (src instanceof DRecordPath) {
        path = src;
        dateString = src.toDateTime().toString(format);
    } else if (src instanceof DRecordId) {
        path = src.toPath(spaceName);
        dateString = src.toDateTime().toString(format);
    } else if (src instanceof DateTime) {
        path = DRecordId.from(src).toPath(spaceName);
        dateString = src.toString(format);
    } else {
        path = DRecordId.from(src).toPath(spaceName);
        dateString = DateTime.from(src).toString(format);
    }

    return (<>{
        <FileLink
            label={dateString}
            path={path.value}
            onOpened={onOpened}
        />
    }</>)
}