export default function Container(props = {}) {
  return (
    <code>
      <style jsx>
        {`
          code {
            font-family: SFMono-Regular, Menlo, Monaco, Consolas,
              Liberation Mono, Courier New, monospace;
            font-variant: none;
            font-feature-settings: "liga" 0, "clig" 0, "calt" 0;
            font-size: 0.85em;
            margin: 0;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            background-color: rgba(27, 31, 35, 0.05);
          }
        `}
      </style>
      {props.children}
    </code>
  );
}
