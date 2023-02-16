interface Command {
  name: string;
  description: string;
  arguments: Argument[];
  subcommands: Command[];
  handler: (args: Record<string, unknown>) => void;
}

interface Argument {
  name: string;
  description: string;
  required: boolean;
}

export class CLI {
  private commands: Command[] = [];

  public addCommand(command: Command) {
    this.commands.push(command);
  }

  public parse(args: string[]) {
    const [commandName, ...commandArgs] = args;

    const command = this.commands.find((cmd) =>
      cmd.name === commandName
    );

    if (!command) {
      console.error(`Command "${commandName}" not found.`);
      this.printHelp();
      Deno.exit(1);
    }

    const parsedArgs = this.parseArgs(commandArgs, command);

    command.handler(parsedArgs);
  }

  private parseArgs(args: string[], command: Command) {
    const parsedArgs: Record<string, unknown> = {};

    const expectedArgs = command.arguments.filter((arg) =>
      arg.required
    );
    if (args.length < expectedArgs.length) {
      console.error(
        `Expected ${expectedArgs.length} arguments but received ${args.length}.`,
      );
      this.printHelp(command);
      Deno.exit(1);
    }

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      const argument = command.arguments[i];
      parsedArgs[argument.name] = arg;
    }

    return parsedArgs;
  }

  private printHelp(command?: Command) {
    if (command) {
      console.log(command.description);

      if (command.arguments.length > 0) {
        console.log('Arguments:');
        for (const arg of command.arguments) {
          console.log(`  ${arg.name}: ${arg.description}`);
        }
      }

      if (command.subcommands.length > 0) {
        console.log('Subcommands:');
        for (const subcommand of command.subcommands) {
          console.log(
            `  ${subcommand.name}: ${subcommand.description}`,
          );
        }
      }
    } else {
      console.log('Usage:');
      console.log('  cli <command> [arguments]');

      console.log('\nAvailable commands:');
      for (const command of this.commands) {
        console.log(`  ${command.name}: ${command.description}`);
      }
    }
  }
}

const cli = new CLI();

const cmd = {
  name: 'greet',
  description: 'Greet someone',
  arguments: [
    {
      name: 'name',
      description: 'Name to greet',
      required: true,
    },
  ],
  subcommands: [],
  handler: (args: Record<string, unknown>) => {
    const { name } = args;
    console.log(`Hello, ${name}!`);
  },
};

cli.addCommand(cmd);

const sleepAndEcho = {
  name: 'slEcho',
  description: 'Sleep for a while and echo a message',
  arguments: [{
    name: 'time',
    description: 'Time to sleep',
    required: true,
  }, {
    name: 'message',
    description: 'Message to echo',
    required: true,
  }],
  subcommands: [],
  handler: async (args: Record<string, unknown>) => {
    const { time, message } = args;
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 * (time as number))
    );
    console.log(message);
  },
};

// deno run --allow-all matey.ts slEcho 2 'Hello, world!'
