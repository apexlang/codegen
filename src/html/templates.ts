export const templates = {
  union: `
<div class="union-definition">
  <h3><a name="<%- name %>"><%- name %></a> = <%- types.map(t=>expandType(t)).join(' | ') %></h3>
  <p><%- description %></p>
  <ol>

</ol>
</div>
  `,
  type: `
  <div class="type-definition">
  <h3><a id="<%- name %>"><%- name %></a></h3>
  <p><%- description %></p>

  <ol>
    <% for (const field of fields) { %>
    <li>
      <span class="name"><%- field.name %></span>
      <span class="type <%- field.type.kind === 'Optional' ? 'optional' : '' %>"><%- expandType(field.type) %></span>
      <% if (field.description) { %><span class="description"><%- field.description %></span> <% } %>
    </li>
    <% } %>
  </ol>
  </div>
  `,
  interface: `
  <div class="interface-definition">
  <h3 id="<%- name %>"><%- name %></h3>
  <p><%- description %></p>
  <ul>
    <% for (const op of operations) { %>
    <li>
    <div class=operation>
      <h4><%- op.name %></h4>
      <% if (op.description) { %><p><%- op.description %></p><% } %>
      <div class=return>
      <span><%- expandType(op.type) %></span>
      </div>
      <div class="parameters">
      <% if (op.parameters.length === 0)  {%>
      <span>None</span>
      <% } else { %>
      <ol>
        <% for (const field of op.parameters) { %>
        <li>
          <span class="name"><%- field.name %></span>
          <span class="type <%- field.type.kind === 'Optional' ? 'optional' : '' %>"><%- expandType(field.type) %></span>
          <% if (field.description) { %><span class="description"><%- field.description %></span> <% } %>
        </li>
        <% } %>
      </ol>
      <% } %>
      </div>
    </div>
    </li>
    <% } %>
  </ul>
</div>

  `,
  index: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <meta
        content="minimum-scale=1, initial-scale=1, width=device-width"
        name="viewport"
      />
      <title><%- title || namespace %></title>
      <meta property="og:type" content="website" />
      <meta property="og:title" content="<%- title || namespace %>" />
      <style>
      <%- styles %>
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="container">
          <div>
            <div>
              <h1><%- title || namespace %></h1>
              <div class="namespace-definition">
                <h2 class="namespace"><span class=label>Namespace</span><%- namespace %></h2>
                <p class="description"><%- description %></p>
              </div>
              <h2>Interfaces</h2>
              <%- interfaces %>
              <h2>Types</h2>
              <%- types %>
              <h2>Enums</h2>
              <%- enums %>
              <h2>Aliases</h2>
              <%- aliases %>
              <h2>Unions</h2>
              <%- unions %>
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>

    `,
  enum: `
<div class="type-definition">
  <h3><a name="<%- name %>"><%- name %></a></h3>
  <p><%- description %></p>
  <ol>
    <% for (const value of values) { %>
    <li>
      <span class="name"><%- value.name %></span>
      <% if (value.description) { %><span class="description"><%- value.description %></span> <% } %>
    </li>
    <% } %>
  </ol>
</div>  `,
  alias: `
<div class="alias-definition">
  <h3><a name="<%- name %>"><%- name %></a> = <%- expandType(type) %></h3>
  <p><%- description %></p>
</div>`,
  styles: `
  body {
    color: rgba(0, 0, 0, 0.87);
    font-family: Arial, sans-serif;
    line-height: 1.4;
    background-color: #fff;
  }

  .wrapper {
    position: relative;
    width: 100%;
    max-width: 872px;
    padding: 0 36px;
    margin: 48px auto 96px;
  }

  .container {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.65em;
    color: rgba(0, 0, 0, 0.87);
  }
  .container .label {
    margin-right: 0.5em;
  }
  .container .label:after {
    content: ":";
  }
  .container a {
    color: #17509a;
    cursor: pointer;
    text-decoration: none;
  }
  .container ol,
  .container p,
  .container ul {
    margin-bottom: 1.4em;
  }
  .container li {
    margin-bottom: 0.35em;
  }
  .container h1,
  .container h2,
  .container h3,
  .container h4 {
    margin-top: 0em;
    margin-bottom: 0.7em;
    font-weight: 400;
    line-height: 1.4em;
  }
  .container h1 {
    font-size: 3em;
  }
  .container h2 {
    font-size: 2em;
  }
  .container h3 {
    font-size: 1.5em;
  }
  .container h4 {
    font-size: 1.25em;
  }
  .container h1 {
    position: relative;
    padding-top: 0.75em;
  }
  .container h1:before {
    content: " ";
    position: absolute;
    top: 0;
    left: 0;
    background: #17509a;
    width: 80px;
    height: 12px;
  }
  .container h2 {
    position: relative;
    padding-bottom: 0.5em;
    border-bottom: solid 2px #17509a;
  }
  .container h2:before {
    content: " ";
    position: absolute;
    bottom: 0;
    background: #17509a;
    width: 60px;
    height: 6px;
  }
  .container h3 {
    color: #17509a;
  }
  .container .interface-definition .operation {
    border-bottom: 4px solid #f0f0f0;
    padding: 1rem;
  }
  .container .interface-definition .return {
    font-family: monospace;
  }
  .container .interface-definition .return:before {
    content: "Return Type: ";
    display: "inline-block";
    font-family: sans-serif;
  }
  .container .interface-definition .parameters {
    padding-top: 1.5rem;
  }
  .container .interface-definition .parameters:before {
    content: "Parameters: ";
    display: "inline-block";
    position: absolute;
    margin-top: -1.5rem;
  }
  .container .interface-definition ul {
    border-left: 1px solid #ccc;
    list-style-type: none;
    padding-left: 1em;
    margin-left: 0.2em;
  }
  .container .interface-definition ul h4 {
    font-family: monospace;
    font-weight: bold;
  }
  .container ol {
    width: 100%;
    margin-bottom: 1.4em;
    padding-left: 1rem;
  }
  .container ol li {
    align-items: flex-start;
    list-style-type: none;
  }
  .container ol li span {
    font-family: monospace;
  }
  .container ol li span.name {
    font-weight: bold;
    min-width: 125px;
  }
  .container ol li span.name:after {
    content: ": ";
    display: "inline";
  }
  .container ol li span.name {
    min-width: 125px;
  }
  .container ol li span.description {
    width: 100%;
    padding-left: 1rem;
    font-family: sans-serif;
    min-width: 125px;
  }
  .container ol .container table td.field-optional {
    width: 2rem;
    text-align: center;
  }
  `,
};
