# Changelog

## 1.0.0

### Added

* Multi-Organization support
* Ability to rename datasets and studies

### Changed

* Improved dynamic reloading of projects, studies, and datasets
* Remove old system setup

### Fixed

* Issue with project admin not being able to delete a study
* Issue with navigation view not updating on logout

## 0.6.1

### Added

* Multiselect on entries

### Fixed

* Project and Study Guard not retrieving user roles correctly
* Changes to project access of datasets not updated without refresh
* Visual indicator to show no datasets accessible to study


## 0.6.0

### Added

* Ability to delete projects
* Ability to delete studies
* Entries can be tagged multiple times in a single study

### Changed

* Tweak wording on video view area in form preview

## 0.5.1

### Fixed

* Dataset name preview no longer ID on new study form
* New projects automatically appear in nav list
* New studies automatically appear in nav list
* Handle when no metadata is present on template download
* Tag form overlapping entry

## 0.5.0

### Added

* Concept of projects
* Project and study visibility

### Changed

* Modified navigation method to use sidenav view
* Have visibility of navigation links be based on user permissions
* Only certain projects can access datasets (based on project permissions)

## 0.4.0

### Added

* Slider field for tagging
* Support for tagging images
* Alert when accessing the webcam for video recording failes
* Ability to record multiple videos for a single tag field

### Changed

* Force user to select a study
* Keep track of selected study across components

### Fixed

* Extra videos in CSV not found in ZIP are reported to the user

## 0.3.0

### Added

* Have videos autoplay and loop in the tagging interface
* Allow for adding new owners and transferring ownership
* Datasets as a way to group entries together
* Recording Video as Tag Field

### Changed

* Store user information and user credentials separately
* "Response" renamed to "Entry"
* Have filenames in the bucket storage be unique

## 0.2.0

### Added

* Paging of the response table view
* Ability to delete responses
* Check for supported video types

### Changed

* Using JWT for authentication
* Create AuthResponse for passing JWT to client
* Moved and improved readability of navigation elements
* Add specific UI for the study control page when no studies exist yet
* Logout ability
* Have thumbnail shown for the response video preview and play the response video on hover

### Fixed

* Non-admin users can now access the studies and enter tagging
* Clear out old files from response ZIP upload
* Handle empty ZIP files

## 0.1.1

### Fixed

* Base URL not being added to videos stored in S3 like containers

## 0.1.0

### Added

* Angular frontend + NestJS backend
* User authentication system
* First time setup form
* Ability to add tags to responses
* Response upload interface
* Creation of new studies
* Per-study user training
* Per-study user access
* Training interface
* Tagging interface
