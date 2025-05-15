'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Form from 'next/form'; // New in Next.js 15
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { createCourse } from '@/lib/actions';
import { University } from '@prisma/client';

interface CourseFormProps {
  universities: University[];
  dictionary: any;
}

export function CourseForm({ universities, dictionary }: CourseFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  
  // Using the new Form component from Next.js 15
  // It provides prefetching, client-side navigation, and progressive enhancement
  return (
    <Form
      action={createCourse}
      onSubmit={() => setIsPending(true)}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courseName">
              {dictionary.courseNameEn}
            </label>
            <Input
              id="courseName"
              name="courseName"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="courseNameUz">
              {dictionary.courseNameUz}
            </label>
            <Input
              id="courseNameUz"
              name="courseNameUz"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="level">
              {dictionary.level}
            </label>
            <select
              id="level"
              name="level"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{dictionary.selectLevel}</option>
              <option value="Undergraduate">{dictionary.undergraduate}</option>
              <option value="Postgraduate">{dictionary.postgraduate}</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="universityId">
              {dictionary.university}
            </label>
            <select
              id="universityId"
              name="universityId"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{dictionary.selectUniversity}</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="campus">
              {dictionary.campus}
            </label>
            <Input
              id="campus"
              name="campus"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="tuitionFee">
              {dictionary.tuitionFee}
            </label>
            <Input
              id="tuitionFee"
              name="tuitionFee"
              type="number"
              step="0.01"
              min="0"
              required
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="currency">
              {dictionary.currency}
            </label>
            <select
              id="currency"
              name="currency"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="selectedIntake">
              {dictionary.intake}
            </label>
            <Input
              id="selectedIntake"
              name="selectedIntake"
              required
              className="w-full"
              placeholder="e.g. September 2025"
            />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="selectedDuration">
            {dictionary.duration}
          </label>
          <Input
            id="selectedDuration"
            name="selectedDuration"
            required
            className="w-full"
            placeholder="e.g. 1 year"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="submissionDeadline">
            {dictionary.deadline}
          </label>
          <Input
            id="submissionDeadline"
            name="submissionDeadline"
            type="date"
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="offerTAT">
            {dictionary.offerTAT}
          </label>
          <Input
            id="offerTAT"
            name="offerTAT"
            type="number"
            min="0"
            className="w-full"
            placeholder="e.g. 2"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="modeOfStudy">
            {dictionary.modeOfStudy}
          </label>
          <select
            id="modeOfStudy"
            name="modeOfStudy"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">{dictionary.selectMode}</option>
            <option value="Full Time">{dictionary.fullTime}</option>
            <option value="Part Time">{dictionary.partTime}</option>
            <option value="Online">{dictionary.online}</option>
            <option value="Blended">{dictionary.blended}</option>
            <option value="Distance Learning">{dictionary.distanceLearning}</option>
          </select>
        </div>
      </div>
      
      <div className="flex items-center">
        <Checkbox id="expressOffer" name="expressOffer" />
        <label htmlFor="expressOffer" className="ml-2 text-sm font-medium text-gray-700">
          {dictionary.expressOffer}
        </label>
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          {dictionary.cancel}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? dictionary.creating : dictionary.createCourse}
        </Button>
      </div>
    </Form>
  );
}