{ pkgs }: {
  channel = "stable-23.11";

  packages = [
    pkgs.nodejs_20
  ];

  env = { };

  idx = {
    extensions = [
      "dbaeumer.vscode-eslint"
      "esbenp.prettier-vscode"
    ];

    previews = {
      enable = true;
      previews = {
        web = {
          command = [ "npm" "run" "dev" ];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };
  };
}
