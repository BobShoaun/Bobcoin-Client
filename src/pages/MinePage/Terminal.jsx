import { useContext, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import { MinePageContext } from ".";

const Terminal = () => {
  const {
    setMiningMode,
    terminalLogs,
    setTerminalLogs,
    miner,
    setMiner,
    parentBlockHash,
    setParentBlockHash,
    isAutoRestart,
    setIsAutoRestart,
    isKeepMiningSolo,
    setIsKeepMiningSolo,
    isKeepMiningPool,
    setIsKeepMiningPool,
  } = useContext(MinePageContext);
  const { params } = useSelector(state => state.consensus);

  const commandInput = useRef(null);
  const commandHistory = useRef([]);
  const commandHistoryCursor = useRef(-1);

  const programs = [
    {
      name: "mine",
      template: "mine [start | stop] [solo | pool]",
      execute: args => {
        const operation = args[1];
        const mode = args[2];
        switch (operation) {
          case "start":
            switch (mode) {
              case "solo":
              case "":
                return setMiningMode("solo");
              case "pool":
                return setMiningMode("pool");
              default:
                throw Error("invalid arguments");
            }
          case "stop":
            return setMiningMode(null);
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "get",
      template: "get [miner | parent | auto-remine | keep-solo-mining | keep-pool-mining]",
      execute: args => {
        const type = args[1];
        switch (type) {
          case "miner":
            return setTerminalLogs(log => [...log, miner]);
          case "parent":
            return setTerminalLogs(log => [...log, parentBlockHash]);
          case "auto-remine":
            return setTerminalLogs(log => [...log, `${isAutoRestart}`]);
          case "keep-solo-mining":
            return setTerminalLogs(log => [...log, `${isKeepMiningSolo}`]);
          case "keep-pool-mining":
            return setTerminalLogs(log => [...log, `${isKeepMiningPool}`]);
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "set",
      template: "set [miner | parent | auto-remine | keep-solo-mining | keep-pool-mining] <value>",
      execute: args => {
        const type = args[1];
        const value = args[2];
        switch (type) {
          case "miner":
            setTerminalLogs(log => [...log, `Set miner to ${value}`]);
            return setMiner(value);
          case "parent":
            setTerminalLogs(log => [...log, `Set parent to ${value}`]);
            return setParentBlockHash(value);
          case "auto-remine": {
            const newValue = value === "true";
            setTerminalLogs(log => [...log, `Set auto-remine to ${newValue}`]);
            setIsAutoRestart(newValue);
            return;
          }
          case "keep-solo-mining": {
            const newValue = value === "true";
            setTerminalLogs(log => [...log, `Set keep-solo-mining to ${newValue}`]);
            setIsKeepMiningSolo(newValue);
            return;
          }
          case "keep-pool-mining": {
            const newValue = value === "true";
            setTerminalLogs(log => [...log, `Set keep-pool-mining to ${newValue}`]);
            setIsKeepMiningPool(newValue);
            return;
          }
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "clear",
      template: "clear",
      execute: () => {
        setTerminalLogs([]);
      },
    },
    {
      name: "help",
      template: "help",
      execute: () => {
        setTerminalLogs(log => [
          ...log,
          `Crappy ${params.name} mining terminal v1.2.0\n\nList of commands:\n${programs
            .map((program, i) => `${i + 1}) ${program.template}`)
            .join("\n")}`,
        ]);
      },
    },
  ];

  useEffect(() => {
    programs[programs.length - 1].execute();
    setTerminalLogs(logs => [...logs, `\n`]);
  }, []);

  const submitCommand = event => {
    event.preventDefault();
    const command = event.target.command.value;
    if (!command) return;
    commandHistory.current.unshift(command);
    commandHistoryCursor.current = -1;

    const args = command.split(" ");
    event.target.command.value = "";

    setTerminalLogs(logs => [...logs, `> ${command}`, "\n"]);

    const program = programs.find(program => program.name === args[0]);
    if (!program) {
      setTerminalLogs(logs => [...logs, `Unknown command: ${args[0]}, type 'help' for help.`, "\n"]);
      return;
    }

    try {
      program.execute(args);
    } catch (e) {
      setTerminalLogs(logs => [...logs, e.toString(), "\n"]);
    }
  };

  const navigateCommandHistory = e => {
    switch (e.key) {
      case "ArrowUp":
        commandHistoryCursor.current = Math.min(commandHistory.current.length - 1, commandHistoryCursor.current + 1);
        e.preventDefault(); // so it wont move cursor to start of text;
        break;
      case "ArrowDown":
        commandHistoryCursor.current = Math.max(-1, commandHistoryCursor.current - 1);
        break;
      default:
        return;
    }
    commandInput.current.value = commandHistory.current[commandHistoryCursor.current] ?? "";
  };

  return (
    <section className="terminal" style={{ flex: "1 0 10em" }}>
      <div className="mt-auto content" style={{ width: "100%" }}>
        {terminalLogs.map((log, index) => (
          <pre className="terminal-output" key={index}>
            {log}
          </pre>
        ))}
        <div className="is-flex is-align-items-center">
          <span className="mr-2 has-text-weight-bold">&gt;</span>
          <form onSubmit={submitCommand} className="is-block" style={{ width: "100%" }}>
            <input
              ref={commandInput}
              onKeyDown={navigateCommandHistory}
              className="terminal-input"
              name="command"
              type="text"
              autoComplete="off"
              style={{ width: "100%" }}
            />
          </form>
        </div>
      </div>
    </section>
  );
};

export default Terminal;
