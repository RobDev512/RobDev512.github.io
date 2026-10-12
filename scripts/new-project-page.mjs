import fs from "node:fs";
import path from "node:path";
import process from "node:process";


const projectId =
  process.argv[2];


function fail(message) {
  console.error(`ERROR: ${message}`);
  process.exit(1);
}


if (!projectId) {
  fail(
    "Uso: node scripts/new-project-page.mjs <project-id>"
  );
}


if (
  !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(
    projectId
  )
) {
  fail(
    "El project-id debe usar minúsculas, números y guiones."
  );
}


const repoRoot =
  process.cwd();

const projectsDir =
  path.join(
    repoRoot,
    "projects"
  );

const templateDir =
  path.join(
    projectsDir,
    "_template"
  );

const targetDir =
  path.join(
    projectsDir,
    projectId
  );


if (
  !fs.existsSync(
    templateDir
  )
) {
  fail(
    "No existe projects/_template."
  );
}


if (
  fs.existsSync(
    targetDir
  )
) {
  fail(
    `Ya existe projects/${projectId}.`
  );
}


fs.mkdirSync(
  targetDir,
  {
    recursive: true
  }
);


const html =
  fs.readFileSync(
    path.join(
      templateDir,
      "index.html"
    ),
    "utf8"
  )
  .replace(
    'data-project-id="CHANGE_ME"',
    `data-project-id="${projectId}"`
  );


fs.writeFileSync(
  path.join(
    targetDir,
    "index.html"
  ),
  html,
  "utf8"
);


const roadmapTemplate =
  fs.readFileSync(
    path.join(
      templateDir,
      "ROADMAP.md.example"
    ),
    "utf8"
  );


fs.writeFileSync(
  path.join(
    targetDir,
    "ROADMAP.md"
  ),
  roadmapTemplate,
  "utf8"
);


console.log(
  `Página creada: projects/${projectId}/`
);

console.log(
  "Siguiente paso: agrega la configuración del proyecto en data/project-pages.json."
);
