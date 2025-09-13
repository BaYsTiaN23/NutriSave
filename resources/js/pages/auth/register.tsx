import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    age?: number;
    weight?: number;
    height?: number;
    medical_condition?: string[];
    dietary_preferences?: string[];
    allergens?: string[];
    weekly_budget?: number;
    goal: string;
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        age: undefined,
        weight: undefined,
        height: undefined,
        medical_condition: [],
        dietary_preferences: [],
        allergens: [],
        weekly_budget: undefined,
        goal: 'balanced',
    });

    const medicalConditions = [
        'diabetes',
        'hypertension',
        'heart_disease',
        'kidney_disease',
        'liver_disease',
        'celiac_disease',
        'thyroid_disorder',
    ];

    const dietaryPrefs = [
        'vegetarian',
        'vegan',
        'gluten_free',
        'dairy_free',
        'low_sodium',
        'low_sugar',
        'high_protein',
        'mediterranean',
        'keto',
    ];

    const commonAllergens = [
        'nuts',
        'shellfish',
        'fish',
        'eggs',
        'dairy',
        'soy',
        'wheat',
        'sesame',
    ];

    const handleCheckboxChange = (field: 'medical_condition' | 'dietary_preferences' | 'allergens', value: string, checked: boolean) => {
        const currentValues = data[field] || [];
        if (checked) {
            setData(field, [...currentValues, value]);
        } else {
            setData(field, currentValues.filter(item => item !== value));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <AuthLayout title="Create an account" description="Enter your details below to create your account">
            <Head title="Register" />
            <form className="flex flex-col gap-6" onSubmit={submit}>
                <div className="grid gap-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Basic Information</h3>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={processing}
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                disabled={processing}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                disabled={processing}
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                disabled={processing}
                                placeholder="Confirm password"
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Details</h3>
                        
                        <div className="grid grid-cols-3 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={data.age || ''}
                                    onChange={(e) => setData('age', e.target.value ? parseInt(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Age"
                                />
                                <InputError message={errors.age} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="weight">Weight (kg)</Label>
                                <Input
                                    id="weight"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="999.99"
                                    value={data.weight || ''}
                                    onChange={(e) => setData('weight', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Weight"
                                />
                                <InputError message={errors.weight} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="height">Height (cm)</Label>
                                <Input
                                    id="height"
                                    type="number"
                                    step="0.1"
                                    min="0.1"
                                    max="999.99"
                                    value={data.height || ''}
                                    onChange={(e) => setData('height', e.target.value ? parseFloat(e.target.value) : undefined)}
                                    disabled={processing}
                                    placeholder="Height"
                                />
                                <InputError message={errors.height} />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weekly_budget">Weekly Budget ($)</Label>
                            <Input
                                id="weekly_budget"
                                type="number"
                                step="0.01"
                                min="0"
                                value={data.weekly_budget || ''}
                                onChange={(e) => setData('weekly_budget', e.target.value ? parseFloat(e.target.value) : undefined)}
                                disabled={processing}
                                placeholder="Weekly food budget"
                            />
                            <InputError message={errors.weekly_budget} />
                        </div>
                    </div>

                    {/* Health Goal */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Health Goal</h3>
                        
                        <div className="grid gap-2">
                            <Label htmlFor="goal">Primary Goal</Label>
                            <Select value={data.goal} onValueChange={(value) => setData('goal', value)} disabled={processing}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select your primary goal" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="weight_loss">Weight Loss</SelectItem>
                                    <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                                    <SelectItem value="diabetes_control">Diabetes Control</SelectItem>
                                    <SelectItem value="hypertension_control">Hypertension Control</SelectItem>
                                    <SelectItem value="balanced">Balanced Diet</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.goal} />
                        </div>
                    </div>

                    {/* Medical Conditions */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Medical Conditions (Optional)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {medicalConditions.map((condition) => (
                                <div key={condition} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`medical_${condition}`}
                                        checked={(data.medical_condition || []).includes(condition)}
                                        onCheckedChange={(checked) => 
                                            handleCheckboxChange('medical_condition', condition, checked as boolean)
                                        }
                                        disabled={processing}
                                    />
                                    <Label 
                                        htmlFor={`medical_${condition}`} 
                                        className="text-sm font-normal capitalize"
                                    >
                                        {condition.replace('_', ' ')}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.medical_condition} />
                    </div>

                    {/* Dietary Preferences */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Dietary Preferences (Optional)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {dietaryPrefs.map((pref) => (
                                <div key={pref} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`dietary_${pref}`}
                                        checked={(data.dietary_preferences || []).includes(pref)}
                                        onCheckedChange={(checked) => 
                                            handleCheckboxChange('dietary_preferences', pref, checked as boolean)
                                        }
                                        disabled={processing}
                                    />
                                    <Label 
                                        htmlFor={`dietary_${pref}`} 
                                        className="text-sm font-normal capitalize"
                                    >
                                        {pref.replace('_', ' ')}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.dietary_preferences} />
                    </div>

                    {/* Allergens */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Allergens (Optional)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {commonAllergens.map((allergen) => (
                                <div key={allergen} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`allergen_${allergen}`}
                                        checked={(data.allergens || []).includes(allergen)}
                                        onCheckedChange={(checked) => 
                                            handleCheckboxChange('allergens', allergen, checked as boolean)
                                        }
                                        disabled={processing}
                                    />
                                    <Label 
                                        htmlFor={`allergen_${allergen}`} 
                                        className="text-sm font-normal capitalize"
                                    >
                                        {allergen}
                                    </Label>
                                </div>
                            ))}
                        </div>
                        <InputError message={errors.allergens} />
                    </div>

                    <Button type="submit" className="mt-6 w-full" disabled={processing}>
                        {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                        Create account
                    </Button>
                </div>

                <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{' '}
                    <TextLink href={route('login')}>
                        Log in
                    </TextLink>
                </div>
            </form>
        </AuthLayout>
    );
}
