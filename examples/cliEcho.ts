import { CLICommandBuilder, handlerArgs } from '../src/command.ts';
import { CLI } from '../src/matey.ts';

// const addSuffix = new CLICommandBuilder()
//   .setName('suffix')
//   .setDescription('Add suffix')
//   .addArgument({
//     name: 'suffixName',
//     description: 'Name of suffix to append',
//     required: true,
//   })
//   .addArgument({
//     name: 'main',
//     description: 'Main message to append to',
//     required: true,
//   })
//   .setHandler((args: handlerArgs) => {
//     const { suffixName, main } = args;
//     console.log(`${main} ${suffixName}`);
//   }).build();

// const cli = new CLI();
// // cli.addCommand(cmd);
// // cli.parse(Deno.args);

// const echoWithSubcommand = new CLICommandBuilder()
//   .setName('echo')
//   .setDescription('Echo a message')
//   .addArgument({
//     name: 'message',
//     description: 'Message to echo',
//     required: true,
//   })
//   .addSubcommand(addSuffix)
//   .setHandler((args: handlerArgs) => {
//     const { message, subcommand } = args;
//     new CLI().parse([subcommand, message]);
//   }).build();

// cli.addCommand(echoWithSubcommand);
// // console.log(Deno.args);
// cli.parse(['echo', 'hello', 'suffix', 'world']);

const addSuffix = new CLICommandBuilder()
  .setName('suffix')
  .setDescription('Add suffix')
  .addArgument({
    name: 'suffixName',
    description: 'Name of suffix to append',
    required: true,
  })
  .addArgument({
    name: 'main',
    description: 'Main message to append to',
    required: true,
  })
  .setHandler((args: handlerArgs) => {
    const { suffixName, main } = args;
    console.log(`${main} ${suffixName}`);
  }).build();

const writeToFile = new CLICommandBuilder()
  .setName('write')
  .setDescription('Write to file')
  .addArgument({
    name: 'filename',
    description: 'File to write to',
    required: true,
  })
  .addArgument({
    name: 'message',
    description: 'Message to write',
    required: true,
  })
  .setHandler((args: handlerArgs) => {
    const { filename, message } = args;
    Deno.writeTextFileSync(filename, message);
  }).build();

const echoWithSubcommand = new CLICommandBuilder()
  .setName('echo')
  .setDescription('Echo a message')
  .addArgument({
    name: 'message',
    description: 'Message to echo',
    required: true,
  })
  .addSubcommand(addSuffix)
  .setHandler((args: handlerArgs) => {
    const { message } = args;
    console.log(message);
  }).build();

const writeWithSubcommand = new CLICommandBuilder()
  .setName('write')
  .setDescription('Write to file')
  .addSubcommand(addSuffix)
  .addArgument({
    name: 'filename',
    description: 'File to write to',
    required: true,
  })
  .setHandler((args: handlerArgs) => {
    const { suffixName, filename } = args;
    const message = suffixName || 'Default message';
    Deno.writeTextFileSync(filename, message);
  }).build();

const cli = new CLI();
cli.addCommand(echoWithSubcommand);
cli.addCommand(writeWithSubcommand);

const args = Deno.args;
if (args.length === 0) {
  console.log('Ты че пидор?');
} else {
  cli.parse(args);
}
