CREATE TABLE `github_repos` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `json_data` text NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `npm_packages` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `json_data` text NOT NULL,
  `updated` datetime NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `package_keywords` (
  `package` varchar(255) NOT NULL DEFAULT '',
  `keyword` varchar(255) NOT NULL DEFAULT '',
  KEY `keyword` (`keyword`),
  KEY `package` (`package`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `packages` (
  `name` varchar(255) NOT NULL DEFAULT '',
  `latest_version` varchar(30) NOT NULL,
  `modified` datetime NOT NULL,
  `license` varchar(30) NOT NULL,
  `repository` varchar(255) NOT NULL DEFAULT '',
  `is_github` tinyint(4) NOT NULL,
  `homepage` varchar(255) NOT NULL DEFAULT '',
  `bugs` varchar(255) NOT NULL,
  `keywords` varchar(255) NOT NULL DEFAULT '',
  `description` varchar(255) NOT NULL DEFAULT '',
  `author_name` varchar(255) NOT NULL DEFAULT '',
  `author_email` varchar(255) NOT NULL DEFAULT '',
  `star_count` int(11) NOT NULL,
  `watch_count` int(11) NOT NULL,
  `fork_count` int(11) NOT NULL,
  PRIMARY KEY (`name`),
  KEY `modified` (`modified`),
  KEY `license` (`license`),
  KEY `keywords` (`keywords`),
  KEY `description` (`description`),
  KEY `author_name` (`author_name`),
  KEY `author_email` (`author_email`),
  KEY `star_count` (`star_count`),
  KEY `watch_count` (`watch_count`),
  KEY `fork_count` (`fork_count`),
  KEY `is_github` (`is_github`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

CREATE TABLE `keyword_suggestions` (
  `word` varchar(255) NOT NULL DEFAULT '',
  `result_count` int(11) NOT NULL,
  PRIMARY KEY (`word`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;
