import { useContext, useEffect, useMemo, useState, useRef } from "react";
import { useSelector } from "react-redux";

import { MinePageContext } from ".";

const Terminal = () => {
  const {
    terminalLogs,
    miner,
    parentBlockHash,
    isAutoRestart,
    isKeepMining,
    setTerminalLogs,
    startMining,
    stopMining,
    setMiner,
    setParentBlockHash,
    setIsAutoRestart,
    setIsKeepMining,
  } = useContext(MinePageContext);
  const { params } = useSelector(state => state.consensus);

  const commandInput = useRef(null);
  const commandHistory = useRef([]);
  const commandHistoryCursor = useRef(-1);

  const programs = [
    {
      name: "mine",
      template: "mine [start | stop]",
      execute: args => {
        const operation = args[1];
        switch (operation) {
          case "start":
            return startMining();
          case "stop":
            return stopMining();
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "get",
      template: "get [miner | parent | auto-restart | keep-mining]",
      execute: args => {
        const type = args[1];
        switch (type) {
          case "miner":
            return setTerminalLogs(log => [...log, miner]);
          case "parent":
            return setTerminalLogs(log => [...log, parentBlockHash]);
          case "auto-restart":
            return setTerminalLogs(log => [...log, `${isAutoRestart}`]);
          case "keep-mining":
            return setTerminalLogs(log => [...log, `${isKeepMining}`]);
          default:
            throw Error("invalid arguments");
        }
      },
    },
    {
      name: "set",
      template: "set [miner | parent | auto-restart | keep-mining] <value>",
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
          case "auto-restart": {
            const newValue = value === "true";
            setTerminalLogs(log => [...log, `Set auto-restart to ${newValue}`]);
            setIsAutoRestart(newValue);
            return;
          }
          case "keep-mining": {
            const newValue = value === "true";
            setTerminalLogs(log => [...log, `Set keep-mining to ${newValue}`]);
            setIsKeepMining(newValue);
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

    setTerminalLogs(logs => [...logs, `> ${command}`]);

    const program = programs.find(program => program.name === args[0]);
    if (!program) {
      setTerminalLogs(logs => [...logs, `Unknown command: ${args[0]}, type 'help' for help.`]);
      return;
    }

    try {
      program.execute(args);
    } catch (e) {
      setTerminalLogs(logs => [...logs, e.toString()]);
    }

    setTerminalLogs(logs => [...logs, `\n`]);
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
    <section className="terminal mb-5" style={{ flex: "1 0 10em" }}>
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
