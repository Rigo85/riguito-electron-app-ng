import shell from "shelljs";
import * as os from "os";

if (["win32", "darwin", "linux"].includes(os.platform())) {
	shell.mkdir(`release-builds/riguito-app-${os.platform()}-x64/public`);
	shell.cp("-R", "public/*", `release-builds/riguito-app-${os.platform()}-x64/public/`);
}
