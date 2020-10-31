import dialog from "@/utils/exts/dialog";

export function errorMessageBox(response) {
    console.log(response, 'ffffffffffff');
  dialog.error(response.message);
}
