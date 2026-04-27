# Project Focus: LinkForge

## Overview
**LinkForge** is a modern, cross-platform desktop application designed to simplify the creation and management of file system links (Symbolic Links, Hard Links, and Junctions) for both Windows and Linux users.

---

## Technical Highlights

### 1. Cross-Platform Core
The application dynamically detects the host operating system to handle the fundamental differences between Windows (`mklink`) and Linux (`ln -s`) link creation commands, ensuring a seamless experience across environments.

### 2. Modern GUI Architecture
Built using **CustomTkinter**, LinkForge provides a responsive, dark-themed interface that bridges the gap between old-school utility and modern aesthetics.

### 3. Admin & Security Awareness
Implemented logic to detect and request administrative or root privileges, which are often required for symbolic link creation on modern operating systems.

---

## Key Features
- **Multiple Link Types**: Supports junctions, symbolic links (files/folders), and hard links.
- **History Panel**: Tracks every link created for easy reference and management.
- **Responsive UI**: Includes tooltips, status updates, and a high-contrast theme for better accessibility.

---

[View Repo on GitHub](https://github.com/Mathew005/LinkForge) | [Back to Projects](#projects.md)
