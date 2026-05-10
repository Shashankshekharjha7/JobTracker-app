import prisma from '../../config/db.js';
import fs from 'fs';
import path from 'path';

export const uploadResume = async (
  userId: string,
  fileData: {
    fileName: string;
    originalName: string;
    fileSize: number;
    mimeType: string;
    filePath: string;
  },
  tags: string[] = [],
  isDefault: boolean = false
) => {
  // If setting as default, unset other defaults
  if (isDefault) {
    await prisma.resume.updateMany({
      where: { userId, isDefault: true },
      data: { isDefault: false },
    });
  }

  return prisma.resume.create({
    data: {
      fileName: fileData.fileName,
      originalName: fileData.originalName,
      fileSize: fileData.fileSize,
      mimeType: fileData.mimeType,
      filePath: fileData.filePath,
      tags,
      isDefault,
      userId,
    },
  });
};

export const getResumes = async (userId: string) => {
  return prisma.resume.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
  });
};

export const getResumeById = async (userId: string, resumeId: string) => {
  return prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });
};

export const deleteResume = async (userId: string, resumeId: string) => {
  const resume = await prisma.resume.findFirst({
    where: {
      id: resumeId,
      userId,
    },
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  // Delete file from filesystem
  if (fs.existsSync(resume.filePath)) {
    fs.unlinkSync(resume.filePath);
  }

  // Delete from database
  return prisma.resume.delete({
    where: { id: resumeId },
  });
};

export const setDefaultResume = async (userId: string, resumeId: string) => {
  // Unset all defaults
  await prisma.resume.updateMany({
    where: { userId, isDefault: true },
    data: { isDefault: false },
  });

  // Set new default
  return prisma.resume.update({
    where: { id: resumeId },
    data: { isDefault: true },
  });
};

export const updateResumeTags = async (
  userId: string,
  resumeId: string,
  tags: string[]
) => {
  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId },
  });

  if (!resume) {
    throw new Error('Resume not found');
  }

  return prisma.resume.update({
    where: { id: resumeId },
    data: { tags },
  });
};