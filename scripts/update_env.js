const yargs = require("yargs");
const { spawnSync } = require("child_process");

const args = process.argv.slice(2);

const argv = yargs(args)
  .option({
    api: {
      type: "boolean",
    },
    web: {
      type: "boolean",
    },
    db: {
      type: "boolean",
    },
    caddy: {
      type: "boolean",
    },
    server: {
      type: "boolean",
    },
  })
  .parse();

function printSeparator() {
  console.log("-".repeat("50"));
}

function main() {
  const filePaths = [];
  const fileMap = {
    api: {
      path: "apps/api",
      exists: argv.api,
    },
    web: {
      path: "apps/sveltastic",
      exists: argv.web,
    },
    db: {
      path: "db",
      exists: argv.db,
    },
    caddy: {
      path: "caddy",
      exists: argv.caddy,
    },
    server: {
      path: "server",
      exists: argv.server,
    },
  };

  const noArgSpecified = Object.values(fileMap).every((value) => !value.exists);

  Object.entries(fileMap).forEach(([key, value]) => {
    if (value.exists || noArgSpecified) {
      filePaths.push(value.path);
    }
  });

  filePaths.forEach((filePath) => {
    const from = `${filePath}/.env.prod`;
    const to = `${process.env.ZDNEVNIK_SSH_CONNECTION}:~/${process.env.ZDNEVNIK_DESTINATION_DIR}/${filePath}/.env.prod`;
    console.log();
    printSeparator();
    console.log(`Copying env file from: ${from} to ${to}`);

    const { stderr } = spawnSync("scp", [`${from}`, `${to}`]);

    if (stderr.length > 0) {
      console.error(stderr.toString("utf8").trim());
    } else {
      console.log("Done!");
    }

    printSeparator();
  });
}

main();
