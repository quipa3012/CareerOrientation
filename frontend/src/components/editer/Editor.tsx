import { Editor as TinyMCEEditor } from "@tinymce/tinymce-react";
import { useRef } from "react";

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const Editor = ({ value, onChange }: EditorProps) => {
    const editorRef = useRef<any>(null);

    return (
        <TinyMCEEditor
            apiKey="m4b2s0d8elnq385zpd0ut9p0uourdh14qzfwvdcgztf2wfdp"
            onInit={(_, editor) => (editorRef.current = editor)}
            value={value}
            onEditorChange={(content) => onChange(content)}
            init={{
                height: 400,
                menubar: false,
                plugins: [
                    "advlist", "autolink", "lists", "link", "image", "charmap",
                    "preview", "anchor", "searchreplace", "visualblocks",
                    "code", "fullscreen", "insertdatetime", "media", "table",
                ],
                toolbar:
                    "undo redo | formatselect | bold italic backcolor | \
                    alignleft aligncenter alignright alignjustify | \
                    bullist numlist outdent indent | removeformat | code",
                content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }"
            }}
        />
    );
};

export default Editor;
